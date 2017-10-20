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

// 初始状态
export function getinitstate() {
  return { req: { fields: [] }, res: {}, set: {} };
}

// 恢复页面状态
export function resetstate(state, initstate) {
  return update(state, { $set: initstate });
}

// 更新设置模式
function updateSetModeFn(state, action) {
  return update(state, { set: { mode: { $set: action.payload } } });
}

// 更新请求参数
function updateFormReqFn(state, action) {
  const newfields = { ...state.req.fields };

  for (const key in action.payload) {
    if (action.payload[key]) {
      newfields[key] = { value: action.payload[key] };
    }
  }

  return update(state, { req: { fields: { $set: newfields } } });
}

export const commonFormReducers = {
  updateSetMode: updateSetModeFn,
  updateFormReq: updateFormReqFn,
};
