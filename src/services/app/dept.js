import request from '../../utils/request';

export function tableData(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/dept/getDeptList.do',
    method: 'POST',
    body: options,
  });
}

export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/dept/getDeptList.do',
    method: 'POST',
    body: options,
  });
}
