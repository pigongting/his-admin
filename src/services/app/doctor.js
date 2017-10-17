import request from '../../utils/request';
import { apiPrefix, apiNexfix } from '../config';

export function tableData(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/getDoctorList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function getRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/getDoctorById${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function insertRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/insertDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function updateRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/updateDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}

export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}doctor/deleteDoctor${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
