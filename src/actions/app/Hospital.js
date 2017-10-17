// 处理医院列表
export function handleHospitalList(dispatch, namespace) {
  dispatch({ type: `${namespace}/fetchHospitalFillter` });
}
