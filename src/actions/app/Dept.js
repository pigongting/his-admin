// 处理科室列表
export function handleDeptList(dispatch, namespace, selectedOptions) {
  if (selectedOptions === true) {
    dispatch({ type: `${namespace}/fetchDeptFillter` });
  } else if (selectedOptions) {
    dispatch({ type: `${namespace}/fetchDeptFillter`, payload: selectedOptions[selectedOptions.length - 1] });
  }
}
