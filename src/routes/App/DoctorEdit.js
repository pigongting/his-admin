import React from 'react';
import { connect } from 'dva';
import { handleDeptList } from '../../actions/app/Dept';
import { handleHospitalList } from '../../actions/app/Hospital';
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
            required: false,
            requiredmsg: '请输入医生名称',
          },
          {
            type: 'Select',
            field: 'hospitalId',
            name: 'hospitalName',
            label: '医院',
            required: false,
            requiredmsg: '请选择医院',
            asynload: this.props.handleHospitalList,
          },
          {
            type: 'Cascader',
            field: 'hospitalDeptId',
            label: '科室',
            required: false,
            requiredmsg: '请选择科室',
            asynload: this.props.handleDeptList,
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
    handleDeptList: selectedOptions => handleDeptList(dispatch, pagespace, selectedOptions),
    handleHospitalList: () => handleHospitalList(dispatch, pagespace),
    handleCascadAddr: () => {
      if (typeof window !== 'undefined') {
        import(/* webpackChunkName: "cascadAddr" */ '../../../data/cascadAddr')
        .then((data) => {
          console.log(data);
        })
        .catch(err => console.log('Failed to load moment', err));
      }
    },
  };
}

export default connect(null, mapDispatchToProps)(AppDoctorEdit);
