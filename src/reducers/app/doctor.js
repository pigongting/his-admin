import update from 'immutability-helper';
import * as fetch from '../../services/app/doctor';
import { changeDataType } from '../../utils/handleData';

// 获取行
export function *fetchGetRow(action, { call, put, select }, namespace) {
  const { data } = yield call(fetch.getRow, { errormsg: '请求失败', ...action }, {}, {
    doctorId: action.payload,
  });

  const newdata = changeDataType(data, [
    {
      field: 'hospitalId',
      target: 'number2string',
    },
    {
      field: 'hospitalDeptId',
      target: 'string2arraynumber',
    },
    {
      field: 'gender',
      target: 'boolean2number',
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
}

// 插入行
export function *fetchInsertRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);
  const newoptions = {};

  for (const key in options) {
    if (options[key].value) {
      if (Object.prototype.toString.call(options[key].value) === '[object Array]') {
        newoptions[key] = options[key].value[options[key].value.length - 1];
      } else {
        newoptions[key] = options[key].value;
      }
    }
  }

  const { data } = yield call(fetch.insertRow, { errormsg: '插入失败', ...action }, {}, newoptions);
  console.log(data);
}
