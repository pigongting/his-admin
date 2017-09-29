import request from '../utils/request';

export function fetch(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.137:8080/crmnew/attr/datagrid',
    method: 'POST',
    body: {
      index: 1,
      size: 10,
    },
  });
}
