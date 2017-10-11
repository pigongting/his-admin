import request from '../utils/request';

export function fetch(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: '/api/v1/menus',
    method: 'POST',
    body: options,
  });
}

export function fetchfillter(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: '/api/v1/menusfillter',
    method: 'POST',
    body: options,
  });
}

export function fetchDong(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/test/getDeptList2.do',
    method: 'POST',
    body: {
      boolpage: true,
      index: 1,
      size: 20,
      order: {
        deptName: '[0,asc]',
      },
      filter: {
        deptName: ['like', ['']],
        hospitalDeptId: ['!=', ['4']],
        createDt: ['<=', ['2017-09-28 14:56:41']],
      },
    },
  });
}

export function batchDelete(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: 'http://120.24.249.69:9001/account/login/',
    method: 'POST',
    body: options,
  });
}
