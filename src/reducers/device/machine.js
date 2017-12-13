import update from 'immutability-helper';
import { notification } from 'antd';
import request from '../../utils/request';
import { changeDataType } from '../../utils/handleData';

/* 插入 */
export function *fetchInsertRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);

  const { data } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.insertDept }),
    { errormsg: '插入失败', ...action }, {}, options,
  );

  // 成功提示
  notification.success({
    message: '插入成功',
    description: '插入医生信息成功',
  });
}

/* 删除 */
export function *fetchDeleteRow(action, { call, put, select }, namespace) {
  // 从表格中删除选中行
  const page = yield select(state => state[namespace].req.page);
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    return !action.payload.includes(item.key);
  });
  yield put({ type: 'updateTable', payload: newSource });
  yield put({
    type: 'updatePages',
    payload: {
      index: page.index,
      size: page.size,
      total: page.total - action.payload.length,
    },
  });

  // 发送删除请求
  const { data } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.deleteDeptArray }),
    { errormsg: '删除失败', ...action }, {}, { id: action.payload },
  );

  // 成功提示
  notification.success({
    message: '删除成功',
    description: '删除医生信息成功',
  });
}

/* 更新 */
export function *fetchUpdateRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);

  const { data } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.updateDept }),
    { errormsg: '更新失败', ...action }, {}, options,
  );

  // 成功提示
  notification.success({
    message: '更新成功',
    description: '更新医生信息成功',
  });
}

/* 查看 */
export function *fetchViewedRow(action, { call, put, select }, namespace) {
  const { data } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.getDeptById }),
    { errormsg: '请求失败', ...action }, {}, { hospitalDeptId: action.payload },
  );

  const newdata = changeDataType(data, [
    {
      field: 'hospitalId',
      target: 'number2string',
    },
    {
      field: 'mainDeptId',
      replace: 'treeExStr',
      target: 'string2arraynumber',
      removelast: true,
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
}

/* 列出分页数据 */
export function *fetchTableData(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });
  const options = yield select(state => state[namespace].req);

  options.page.index = (action.payload && action.payload.index) ? action.payload.index : options.page.index;
  options.page.size = (action.payload && action.payload.size) ? action.payload.size : options.page.size;
  if (!options.filters) { options.filters = {}; }
  if (!options.filters.mainDeptId) { options.filters.mainDeptId = ['=', [null]]; }

  const { data, headers } = yield call(
    (atp, config, opp) => request(atp, config, { method: 'POST', body: opp, Url: iface.getAllMachine }),
    { errormsg: '表格数据请求失败', ...action }, {}, options,
  );

  yield put({ type: 'updateTable', payload: data });
  yield put({ type: 'updatePages', payload: headers });
}
