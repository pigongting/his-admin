import request from '../utils/request';

export function fetch(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: '/api/v1/menus',
    method: 'POST',
    body: options,
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
