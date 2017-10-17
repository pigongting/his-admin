// 处理医院列表
export function handleHospitalList(dispatch, namespace, form) {
  // 更新请求条件
  dispatch({
    type: `${namespace}/updateFormReq`,
    payload: form.getFieldsValue(),
  });

  dispatch({ type: `${namespace}/fetchHospitalFillter` });
}
