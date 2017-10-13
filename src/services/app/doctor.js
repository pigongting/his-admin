import request from '../../utils/request';

export function tableData(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/getDoctorList.do',
    method: 'POST',
    body: options,
  });
}

export function deleteRow(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/doctor/getDoctorList.do',
    method: 'POST',
    body: options,
  });
}

export function deptFillter(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/dept/getAllDeptList.do',
    method: 'POST',
    body: options,
  });
}

export function hospitalFillter(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.3.201:8080/WiseMedical/hospital/getAllHospitalList.do',
    method: 'POST',
    body: options,
  });
}
