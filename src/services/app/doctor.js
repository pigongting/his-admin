import request from '../../utils/request';

export function fetch(action, config, options) {
  return request(action, config, {
    Url: 'http://192.168.33.201:8080/WiseMedical/doctor/getDoctorList.do',
    method: 'POST',
    body: options,
  });
}
