import request from '../utils/request';

export function fetch(action, config, options) {
  return request(action, config, {
    url: 'http://192.168.3.154:8080/WiseMedical/dept/getDeptList.do',
    method: 'POST',
    body: {
      boolpage: false,
      index: 1,
      size: 20,
      order:
      {
        ProductName: [0, 'desc'],
        Product: [1, 'desc'],
      },
      filter: {
        ProductName: ['like', '关键字'],
        parentid: ['=', '123'],
      },
    },
  });
}

export function fetch2(action, config, options) {
  return request(action, config, {
    url: 'http://192.168.3.137:8080/crmnew/attr/datagrid',
    method: 'POST',
    body: {
      index: 1,
      size: 20,
      order:
      {
        ProductName: [0, 'desc'],
        Product: [1, 'desc'],
      },
      filter: {
        ProductName: ['like', '关键字'],
        parentid: ['=', '123'],
      },
    },
  });
}
