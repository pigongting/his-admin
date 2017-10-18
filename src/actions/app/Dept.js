// 处理科室列表
export function handleDeptTreeData(dispatch, namespace, selectedOptions) {
  if (selectedOptions === true) {
    dispatch({ type: `${namespace}/fetchDeptTreeData` });
  } else if (selectedOptions) {
    dispatch({ type: `${namespace}/fetchDeptTreeData`, payload: selectedOptions[selectedOptions.length - 1] });
  }
}
