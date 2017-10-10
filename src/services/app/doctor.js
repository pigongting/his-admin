import request from '../../utils/request';

export function fetch(action, config, options) {
  console.log(options);
  return request(action, config, {
    Url: 'http://192.168.3.154:8080/WiseMedical/doctor/getDoctorList.do',
    method: 'POST',
    body: options,
  });
}
