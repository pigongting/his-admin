import update from 'immutability-helper';

// 更新级联地址
export function updateCascadAddr(state, action) {
  return update(state, { res: { [action.field]: { $set: action.payload } } });
}
