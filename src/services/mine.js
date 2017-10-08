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
    Url: '/api/v1/menusDelete',
    method: 'POST',
    body: options,
  });
}
