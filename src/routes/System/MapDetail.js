import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'systemmapdetail';

class SystemMapDetail extends React.Component {
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
            field: 'deptAddress',
            label: '楼宇',
            required: false,
            requiredmsg: '请输入科室地址',
          },
          {
            type: 'Input',
            field: 'deptFloor',
            label: '楼层',
            required: false,
            requiredmsg: '请输入科室楼',
          },
          {
            type: 'Input',
            field: 'deptName',
            label: '科室',
            required: false,
            requiredmsg: '请输入科室名称',
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(null, mapDispatchToProps)(SystemMapDetail);
