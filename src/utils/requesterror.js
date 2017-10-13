import React from 'react';
// antd 组件
import { notification, Button } from 'antd';

const retryErrorType = ['dataError', 'timeout'];
const errorDesc = {
  addressError: '请检查是否写错了请求地址，或者请求地址服务没开',
  requestState: '请检查请求参数，服务器程序',
  dataError: '请检查请求参数，服务器程序',
  timeout: '请检查网络',
};

function retry(openkey, dispatch, frommodel) {
  // 删除错误提示
  notification.close(openkey);

  setTimeout(() => {
    const pathname = window.location.pathname.replace(/[/]/g, '_');
    const errorActionHook = `fetchErrorActionHook${pathname}`;

    for (const i in window[errorActionHook]) {
      if (window[errorActionHook][i]) {
        const item = window[errorActionHook][i];

        if (frommodel) {
          const namespaceReg = new RegExp(`${item.namespace}/`);
          item.type = (item.type).replace(namespaceReg, '');
        }

        dispatch(item);
      }
    }

    window[errorActionHook] = {};
  }, 300);
}

function fetchErrorNotification(dispatch, action) {
  const openkey = `open${Date.now()}`;
  const notify = {
    key: openkey,
    description: errorDesc[action.errortype],
    message: action.errormsg,
  };
  // 可以重试的错误类型
  if (retryErrorType.includes(action.errortype)) {
    notify.duration = 0;
    notify.btn = (<Button type="primary" size="small" onClick={() => retry(openkey, dispatch)}>重试</Button>);
  }
  // 显示错误提示
  notification.error(notify);
}

function onError(e, dispatch) {
  let pathname = '';
  let errorActionHook = '';

  if (typeof window !== 'undefined') {
    pathname = window.location.pathname.replace(/[/]/g, '_');
    errorActionHook = `fetchErrorActionHook${pathname}`;
  }

  let msg = null;
  try {
    msg = JSON.parse(e.message);
  } catch (error) {
    msg = e.message;
  }

  // fetch错误统一处理
  if (msg.status === 'fetcherror') {
    switch (msg.message) {
      case '被抛弃的请求':
      case '请求超时':
        console.log(msg.message);
        break;
      default:
        break;
    }

    // 超时和请求错误允许重试
    if (msg.erroraction) {
      const action = msg.erroraction;
      action.namespace = action.type.split('/')[0];
      action.errortype = msg.errortype;

      // 保存错误请求
      if (typeof window !== 'undefined') {
        if (!global[errorActionHook]) {
          global[errorActionHook] = {};
        }
        global[errorActionHook][action.type] = action;
      }

      // 显示错误提示
      fetchErrorNotification(dispatch, action);
    }
  }
}

export default { onError };
