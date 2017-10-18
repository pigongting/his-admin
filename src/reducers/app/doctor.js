import update from 'immutability-helper';
import { notification } from 'antd';
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
      replace: 'treeExStr',
      target: 'string2arraynumber',
    },
    {
      field: 'gender',
      target: 'boolean2number',
    },
    {
      field: 'birthday',
      target: 'time2moment',
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
}

// 插入行
export function *fetchInsertRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);
  const { data } = yield call(fetch.insertRow, { errormsg: '插入失败', ...action }, {}, options);

  // 成功提示
  notification.success({
    message: '插入成功',
    description: '插入医生信息成功',
  });
}

// 更新行
export function *fetchUpdateRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);
  const { data } = yield call(fetch.updateRow, { errormsg: '更新失败', ...action }, {}, options);

  // 成功提示
  notification.success({
    message: '更新成功',
    description: '更新医生信息成功',
  });
}

// 删除行
export function *fetchDeleteRow(action, { call, put, select }, namespace) {
  const options = yield select(state => state[namespace].req);
  const { data } = yield call(fetch.deleteRow, { errormsg: '删除失败', ...action }, {}, options);

  // 成功提示
  notification.success({
    message: '删除成功',
    description: '删除医生信息成功',
  });
}
