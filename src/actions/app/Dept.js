// 处理科室列表
export function handleDeptList(dispatch, namespace, form, selectedOptions) {
  // 更新请求条件
  dispatch({
    type: `${namespace}/updateFormReq`,
    payload: form.getFieldsValue(),
  });

  if (selectedOptions === true) {
    dispatch({ type: `${namespace}/fetchDeptFillter` });
  } else if (selectedOptions) {
    dispatch({ type: `${namespace}/fetchDeptFillter`, payload: selectedOptions[selectedOptions.length - 1] });
  }
}
