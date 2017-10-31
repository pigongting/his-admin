import update from 'immutability-helper';
import { notification } from 'antd';
import * as fetch from '../../services/app/dept';
import { changeDataType } from '../../utils/handleData';

/* 删除 */
export function *fetchDeleteRow(action, { call, put, select }, namespace) {
  // 从表格中删除选中行
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    return !action.payload.includes(item.key);
  });
  yield put({ type: 'updateTable', payload: newSource });

  // 发送删除请求
  for (let i = 0; i < action.payload.length; i++) {
    const { data } = yield call(fetch.deleteRow, { errormsg: '删除失败', ...action }, {}, { doctorId: action.payload[i] });

    // 成功提示
    notification.success({
      message: '删除成功',
      description: '删除医生信息成功',
    });
  }
}

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

// 列出全部级别数据
export function *fetchDeptTreeData(action, { call, put, select }, namespace) {
  const { data } = yield call(fetch.listTreeData, { errormsg: '科室列表加载失败', ...action }, {}, {});
  yield put({ type: 'updateDeptTreeData', payload: data });
}

// 更新科室树形数据
export function updateDeptTreeData(state, action) {
  return update(state, { res: { hospitalDeptId: { $set: action.payload } } });
}

/* 列出分页数据 */
export function *fetchTableData(action, { call, put, select }, namespace) {
  console.log(namespace);
  yield put({ type: 'resetTable' });
  const options = yield select(state => state[namespace].req);

  options.page.index = (action.payload && action.payload.index) ? action.payload.index : options.page.index;
  options.page.size = (action.payload && action.payload.size) ? action.payload.size : options.page.size;

  try {
    const aa = yield call(fetch.listOneLevelData, { errormsg: '表格数据请求失败', ...action }, {}, {
      hospitalDeptId: 0,
    });
    console.log(aa);
  } catch (e) {
    console.log(e);
  }

  // yield put({ type: 'updateTable', payload: data });
  // yield put({ type: 'updatePages', payload: headers });
}
