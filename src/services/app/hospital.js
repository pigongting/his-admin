import request from '../../utils/request';
import { apiPrefix, apiNexfix } from '../config';

export function hospitalFillter(action, config, options) {
  return request(action, config, {
    Url: `${apiPrefix}hospital/getAllHospitalList${apiNexfix}`,
    method: 'POST',
    body: options,
  });
}
