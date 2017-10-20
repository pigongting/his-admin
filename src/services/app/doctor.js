import request from '../../utils/request';
import { apiPrefix, apiNexfix } from '../config';

/* 插入 */
export function insertRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/insertDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
/* 删除 */
export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/deleteDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
/* 更新 */
export function updateRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/updateDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
/* 查看 */
export function viewedRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/getDoctorById${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
/* 列出分页数据 */
export function listPageData(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: `${apiPrefix}doctor/getDoctorList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
/* 列出全部数据 */
export function listAllData(action, config, options) {}
/* 列出指定级别数据 */
export function listTreeData(action, config, options) {}
/* 列出全部级别数据 */
export function listOneLevelData(action, config, options) {}
