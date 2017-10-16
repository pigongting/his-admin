import request from '../../utils/request';

const { config: commonconfig } = require('../../../data/common');

const { apiPrefix } = commonconfig;

export function tableData(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/getDoctorList.do',
    method: 'POST',
    body: options,
  });
}

export function insertRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/insertDoctor.do',
    method: 'POST',
    body: options,
  });
}

export function updateRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/updateDoctor.do',
    method: 'POST',
    body: options,
  });
}

export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/deleteDoctor.do',
    method: 'POST',
    body: options,
  });
}

export function getRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/getDoctorById.do',
    method: 'POST',
    body: options,
  });
}

export function deptFillter(action, config, options) {
  return request(action, config, {
    // Url: 'http://192.168.3.201:8080/WiseMedical/dept/getAllDeptList.do',
    Url: `${apiPrefix}/dept/getAllDeptList`,
    method: 'POST',
    body: options,
  });
}

export function hospitalFillter(action, config, options) {
  return request(action, config, {
    // Url: 'http://192.168.3.201:8080/WiseMedical/hospital/getAllHospitalList.do',
    Url: `${apiPrefix}/hospital/getAllHospitalList`,
    method: 'POST',
    body: options,
  });
}
