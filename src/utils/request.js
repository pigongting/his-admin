import fetch from 'dva/fetch';

/**
 * 验证请求状态
 *
 * @param  {object} response      返回值对象
 * @param  {object} [action]      原生 dispatch 的那个完整的 action
 * @param  {string} timestamp     时间戳，仅仅为了输出看看
 * @return {object}               正常时返回 response，否则抛出错误
 */
function checkStatus(response, action, timestamp) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // console.log(timestamp);
  // console.log(global[`${action.type}_fetchTimestamp`]);
  global[`${action.type}_fetchTimestamp`] = undefined;

  throw new Error(JSON.stringify({
    status: 'fetcherror',
    message: response.statusText,
    erroraction: action,
  }));
}

/**
 * 验证请求结果
 *
 * @param  {object} data          服务器返回的 JSON 格式的数据
 * @param  {object} action        原生 dispatch 的那个完整的 action
 * @param  {string} timestamp     时间戳，仅仅为了输出看看
 * @return {object}               正常时返回 data，否则抛出错误
 */
function checkData(data, action, timestamp) {
  // 虚拟返回数据
  // if (data) {
  //   return data;
  // }

  // 真实返回数据
  if (data.code >= 200 && data.code < 300) {
    return data;
  }

  // console.log(timestamp);
  // console.log(global[`${action.type}_fetchTimestamp`]);
  global[`${action.type}_fetchTimestamp`] = undefined;

  // 虚拟返回数据
  // throw new Error(JSON.stringify({
  //   status: 'fetcherror',
  //   message: 'mock',
  //   erroraction: action,
  // }));

  // 真实返回数据
  throw new Error(JSON.stringify({
    status: 'fetcherror',
    message: data.msg,
    code: data.code,
  }));
}

/**
 * 超时函数-生成和 fetch 竞赛的 promise 的函数.
 *
 * @param  {number} timeout     超时时间
 * @param  {object} action      原生 dispatch 的那个完整的 action
 * @return {object}             a promise
 */
function timeoutHandle(timeout, action) {
  clearTimeout(global[`${action.type}_fetchTimeoutId`]);
  global[`${action.type}_fetchTimeoutId`] = undefined;

  const p = new Promise((resolve, reject) => {
    global[`${action.type}_fetchTimeoutId`] = setTimeout(() => {
      reject({
        status: 'fetcherror',
        message: '请求超时',
        erroraction: action,
      });
    }, timeout);
  }).catch((err) => {
    throw new Error(JSON.stringify(err));
  });

  return p;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} action      原生 dispatch 的那个完整的 action
 * @param  {object} config      mode 设置对之前的请求的处理方式 [wait 阻止现在的请求，等待之前的请求 | stop 停止之前的请求]
                                timeout 请求超时时间
 * @param  {object} options     Url 请求地址
                                method 请求方式 [GET | POST]
                                ...
 * @return {object}             An object containing either "data" or "err"
 */
export default async function request(action, { mode = 'wait', timeout = 10000 }, options) {
  // console.log(action);

  // 请求时间戳
  const timestamp = new Date().getTime();
  // console.log(timestamp);

  // 等待上一个请求完成
  if (mode === 'wait' && global[`${action.type}_fetchTimestamp`]) {
    throw new Error(JSON.stringify({
      status: 'fetcherror',
      message: '等待上一个请求完成',
    }));
  }

  // 停止上一个请求，仅使用新请求的返回值
  if (mode === 'stop' && global[`${action.type}_fetchTimestamp`]) {
    global[`${action.type}_fetchTimestamp`] = timestamp;
  }

  // 干净的请求
  if (global[`${action.type}_fetchTimestamp`] === undefined) {
    global[`${action.type}_fetchTimestamp`] = timestamp;
  }

  // 请求设置
  const fetchset = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;',
    },
  };

  if (options.method && options.method !== 'GET') {
    fetchset.method = options.method;
  }

  if (options.method === 'POST') {
    fetchset.body = JSON.stringify(options.body);
  }

  console.log(fetchset);

  // 请求和超时赛跑
  const response = await Promise.race([
    timeoutHandle(timeout, action),
    fetch(options.Url, {
      method: 'POST',
      mode: 'no-cors',
      redirect: 'follow',
      body: 'index=1&size=10',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    }),
  ]).then((res) => {
    console.log(res.headers.get('Content-Type'));
    clearTimeout(global[`${action.type}_fetchTimeoutId`]);
    global[`${action.type}_fetchTimeoutId`] = undefined;
    return res;
  }).catch((err) => {
    // console.log(timestamp);
    // console.log(global[`${action.type}_fetchTimestamp`]);
    global[`${action.type}_fetchTimestamp`] = undefined;
    throw err;
    // err 可能的值
    // Error: {"status":"error","message":"请求超时"}
    // TypeError: Failed to fetch
  });

  // 不匹配的请求
  if (global[`${action.type}_fetchTimestamp`] !== timestamp) {
    // console.log(timestamp);
    // console.log(global[`${action.type}_fetchTimestamp`]);
    throw new Error(JSON.stringify({
      status: 'fetcherror',
      message: '被抛弃的请求',
    }));
  }

  // 验证请求状态
  checkStatus(response, action, timestamp);

  // 将请求返回值转为json
  const datajson = await response.json();

  // 手动格式
  const dataformat = {
    code: 200,
    msg: 'success',
    data: datajson,
  };

  // 验证请求结果
  checkData(dataformat, action, timestamp);

  // 定义返回结果
  const ret = {};

  if (datajson.rows) {
    // 列表
    datajson.rows.map((item, index) => {
      const ele = item;
      ele.key = item.id;
      return ele;
    });

    ret.data = datajson.rows;
    ret.headers = {
      index: datajson.index,
      size: datajson.size,
      total: datajson.total,
    };
  } else {
    // 对象
    ret.data = datajson;
    ret.headers = {};
  }

  // 从请求返回值的头信息中获取信息
  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }

  // return 返回结果
  // console.log(timestamp);
  // console.log(global[`${action.type}_fetchTimestamp`]);
  global[`${action.type}_fetchTimestamp`] = undefined;
  return ret;
}
