import request from '../../utils/request';
import { apiPrefix, apiNexfix } from '../config';

export function tableData(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}dept/getDeptList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}dept/getDeptList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function deptFillter(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}dept/getOneLevelDeptList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
