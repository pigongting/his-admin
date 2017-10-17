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
        dispatch({ type: 'fetchGetRow', payload: query.id });
      } else {
        dispatch({ type: 'updateSetMode', payload: 'view' });
      }
    } else {
      dispatch({ type: 'updateSetMode', payload: 'adds' });
    }
  });
}

// 通用状态
export function getinitstate({ field }) {
  const newreq = {};

  field.map((item, index) => {
    newreq[item] = { value: null };
    return item;
  });

  return { req: newreq, res: {}, set: {} };
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
  const newreq = { ...state.req };

  for (const key in action.payload) {
    if (action.payload[key]) {
      try {
        newreq[key] = { value: action.payload[key].format('YYYY-MM-DD HH:mm:ss') };
      } catch (e) {
        newreq[key] = { value: action.payload[key] };
      }
    }
  }

  return update(state, { req: { $set: newreq } });
}
