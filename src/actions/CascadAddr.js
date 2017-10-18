// 处理科室列表
export function handleCascadAddr(dispatch, namespace, fieldname) {
  if (typeof window !== 'undefined') {
    import(/* webpackChunkName: "cascadAddr" */ '../../data/cascadAddr')
    .then((data) => {
      dispatch({ type: `${namespace}/updateCascadAddr`, payload: data, field: fieldname });
    })
    .catch(err => console.log('Failed to load cascadAddr', err));
  }
}
