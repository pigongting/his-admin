import React from 'react';
import { connect } from 'dva';
import { importCascadAddr } from '../../reducers/cascadAddr';
import FormPage from '../../components/FormPage';

const pagespace = 'appdoctoredit';

class AppDoctorEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        pagetitle={{
          adds: '新增医生',
          edit: '编辑医生信息',
          view: '查看医生信息',
        }}
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
            asynload: this.props.handleHospitalAllData,
          },
          {
            type: 'Cascader',
            field: 'hospitalDeptId',
            label: '科室',
            required: true,
            requiredmsg: '请选择科室',
            asynload: this.props.handleDeptTreeData,
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
            type: 'Cascader',
            field: 'pcaCode',
            label: '地区',
            asynload: this.props.handleCascadAddr,
          },
          {
            type: 'Input',
            field: 'title',
            label: '职称',
            required: false,
            requiredmsg: '请输入医生职称',
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
    handleDeptTreeData: () => dispatch({ type: `${pagespace}/fetchDeptTreeData` }),
    handleHospitalAllData: () => dispatch({ type: `${pagespace}/fetchHospitalAllData` }),
    handleCascadAddr: () => importCascadAddr(dispatch, pagespace, 'pcaCode'),
  };
}

export default connect(null, mapDispatchToProps)(AppDoctorEdit);
