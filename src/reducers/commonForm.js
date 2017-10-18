import update from 'immutability-helper';
import { removelocal } from '../utils/localpath';

// 建立
export function setup({ dispatch, history }, pagepath) {
  return history.listen(({ pathname, query }) => {
    if (removelocal(pathname) !== pagepath) {
      dispatch({ type: 'resetstate' });
    } else if (query.id === '1') {
      if (query.edit === '1') {
        dispatch({ type: 'updateSetMode', payload: 'edit' });
      } else {
        dispatch({ type: 'updateSetMode', payload: 'view' });
      }
      dispatch({ type: 'fetchViewedRow', payload: query.id });
    } else {
      dispatch({ type: 'updateSetMode', payload: 'adds' });
    }
  });
}

// 通用状态
export function getinitstate({ field }) {
  const newfields = {};

  field.map((item, index) => {
    newfields[item] = { value: undefined };
    return item;
  });

  return { req: { fields: newfields }, res: {}, set: {} };
}

// 恢复页面状态
export function resetstate(state, initstate) {
  return update(state, { $set: initstate });
}

// 更新设置模式
export function updateSetMode(state, action) {
  return update(state, { set: { mode: { $set: action.payload } } });
}

// 更新请求参数
export function updateFormReq(state, action) {
  const newfields = { ...state.req.fields };

  for (const key in action.payload) {
    if (action.payload[key]) {
      newfields[key] = { value: action.payload[key] };
    }
  }

  return update(state, { req: { fields: { $set: newfields } } });
}

// 更新级联地址
export function updateCascadAddr(state, action) {
  return update(state, { res: { [action.field]: { $set: action.payload } } });
}
