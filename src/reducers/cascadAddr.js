import update from 'immutability-helper';

// 导入级联地址
export function importCascadAddr(dispatch, namespace, fieldname) {
  if (typeof window !== 'undefined') {
    import(/* webpackChunkName: "cascadAddr" */ '../../data/cascadAddr')
    .then((data) => {
      dispatch({ type: `${namespace}/updateCascadAddr`, payload: data, field: fieldname });
    })
    .catch(err => console.log('Failed to load cascadAddr', err));
  }
}

// 更新级联地址
export function updateCascadAddr(state, action) {
  return update(state, { res: { [action.field]: { $set: action.payload } } });
}
