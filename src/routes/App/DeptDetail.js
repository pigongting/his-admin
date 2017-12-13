import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'appdeptdetail';

class AppDeptDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        pagetitle={{
          adds: '新增科室',
          edit: '编辑科室信息',
          view: '查看科室信息',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Input',
            field: 'deptName',
            label: '科室名称',
            required: false,
            requiredmsg: '请输入科室名称',
          },
          {
            type: 'Select',
            field: 'hospitalId',
            name: 'hospitalName',
            label: '医院',
            required: false,
            requiredmsg: '请选择医院',
            asynload: this.props.handleHospitalAllData,
          },
          {
            type: 'Cascader',
            field: 'mainDeptId',
            label: '父科室',
            required: false,
            requiredmsg: '请选择科室',
            asynload: this.props.handleDeptTreeData,
            changeOnSelect: true,
          },
          {
            type: 'Input',
            field: 'deptFloor',
            label: '科室楼',
            required: false,
            requiredmsg: '请输入科室楼',
          },
          {
            type: 'Input',
            field: 'deptAddress',
            label: '科室地址',
            required: false,
            requiredmsg: '请输入科室地址',
          },
          {
            type: 'TextArea',
            field: 'remark',
            label: '备注',
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
  };
}

export default connect(null, mapDispatchToProps)(AppDeptDetail);
