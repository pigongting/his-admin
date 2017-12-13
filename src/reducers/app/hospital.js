import update from 'immutability-helper';
import request from '../../utils/request';

// 获取筛选
export function *fetchHospitalAllData(action, { call, put, select }, namespace) {
  const { data } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.getAllHospitalList }),
    { errormsg: '医院列表加载失败', ...action }, {}, {},
  );

  yield put({ type: 'updateHospitalAllData', payload: data });
}

// 更新筛选
export function updateHospitalAllData(state, action) {
  return update(state, { res: { hospitalId: { $set: action.payload } } });
}
