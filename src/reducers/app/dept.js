import update from 'immutability-helper';
import * as fetch from '../../services/app/dept';

// 获取筛选
// export function *fetchDeptFillter(action, { call, put, select }, namespace) {
//   const targetOption = action.payload;
//   // 转圈
//   if (targetOption) { targetOption.loading = true; }
//   // 请求数据
//   const { data } = yield call(fetch.deptFillter, { errormsg: '科室列表加载失败', ...action }, {}, {
//     hospitalDeptId: (targetOption && targetOption.hospitalDeptId) || 0,
//   });
//   // 处理数据
//   data.map((item, index) => {
//     const newitem = item;
//     newitem.value = item.hospitalDeptId;
//     newitem.label = item.deptName;
//     newitem.isLeaf = !item.leaf;
//     return newitem;
//   });
//   // 改变状态
//   if (targetOption) {
//     targetOption.loading = false;
//     targetOption.children = data;
//     const options = yield select(state => state[namespace].res.hospitalDeptId);
//     yield put({ type: 'updateDeptTreeData', payload: [...options] });
//   } else {
//     yield put({ type: 'updateDeptTreeData', payload: data });
//   }
// }

// 获取筛选
export function *fetchDeptTreeData(action, { call, put, select }, namespace) {
  const { data } = yield call(fetch.listTreeData, { errormsg: '科室列表加载失败', ...action }, {}, {});
  yield put({ type: 'updateDeptTreeData', payload: data });
}

// 更新筛选
export function updateDeptTreeData(state, action) {
  return update(state, { res: { hospitalDeptId: { $set: action.payload } } });
}
