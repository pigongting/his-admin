import React from 'react';
import update from 'immutability-helper';
import moment from 'moment';
import { connect } from 'dva';
// 自定义组件
import FormPage from '../../components/FormPage';
// 级联地址
import { cascadAddr } from '../../../data/cascadAddr';

// 页内配置
const pageConfig = {
  namespace: 'appdoctoredit',
};

class AppDoctorEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pagedata, loading, locale } = this.props;

    return (
      <FormPage
        namespace={pageConfig.namespace}
        pagedata={pagedata}
        pagetitle="新增医生"
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Input',
            field: 'doctorName',
            label: '医生名称',
            required: true,
            requiredmsg: '请输入医生名称',
          },
          {
            type: 'Select',
            field: 'hospitalId',
            name: 'hospitalName',
            label: '医院',
            required: true,
            requiredmsg: '请选择医院',
            asynload: this.props.loadHospitalData,
          },
          {
            type: 'Cascader',
            field: 'hospitalDeptId',
            label: '科室',
            required: true,
            requiredmsg: '请选择科室',
            asynload: this.props.loadDeptData,
            changeOnSelect: true,
          },
          {
            type: 'Radio',
            field: 'gender',
            label: '性别',
            options: [{ value: 1, name: '男' }, { value: 2, name: '女' }],
          },
          {
            type: 'DatePicker',
            field: 'birthday',
            label: '出生日期',
          },
          {
            type: 'TextArea',
            field: 'intro',
            label: '简介',
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadDeptData: (form, selectedOptions) => {
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });

      if (selectedOptions === true) {
        dispatch({ type: `${pageConfig.namespace}/fetchDeptFillter` });
      } else if (selectedOptions) {
        dispatch({ type: `${pageConfig.namespace}/fetchDeptFillter`, payload: selectedOptions[selectedOptions.length - 1] });
      }
    },
    loadHospitalData: (form) => {
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });

      dispatch({ type: `${pageConfig.namespace}/fetchHospitalFillter` });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pageConfig.namespace],
    loading: state.loading.effects[`${pageConfig.namespace}/fetchTableData`],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDoctorEdit);
