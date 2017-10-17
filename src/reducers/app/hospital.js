import update from 'immutability-helper';

// 请求服务
import * as fetch from '../../services/app/hospital';

// 获取筛选
export function *fetchHospitalFillter(action, { call, put, select }, namespace) {
  const { data } = yield call(fetch.hospitalFillter, { errormsg: '医院列表加载失败', ...action }, {}, {});
  yield put({ type: 'updateHospitalFillter', payload: data });
}

// 更新筛选
export function updateHospitalFillter(state, action) {
  return update(state, { res: { hospitalId: { $set: action.payload } } });
}
