import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { handleDeptTreeData } from '../../actions/app/Dept';
import { handleHospitalAllData } from '../../actions/app/Hospital';
import { handleCascadAddr } from '../../actions/CascadAddr';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'appdoctor';

class AppDoctor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormTablePage
        namespace={pagespace}
        searchPlaceholder="搜索医生..."
        searchOptions={[
          {
            title: '医生名称',
            value: 'doctorName',
          },
          {
            title: '手机号码',
            value: 'mobile',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'hospitalId',
            name: 'hospitalName',
            label: '医院',
            width: 220,
            asynload: this.props.handleHospitalAllData,
          },
          {
            type: 'Cascader',
            field: 'hospitalDeptId',
            label: '科室',
            width: 220,
            asynload: this.props.handleDeptTreeData,
            changeOnSelect: true,
          },
        ]}
        columns={[
          {
            title: '医生名称',
            dataIndex: 'doctorName',
            sorter: true,
          },
          {
            title: '医生头衔',
            dataIndex: 'doctorCap',
          },
          {
            title: '手机号码',
            dataIndex: 'mobile',
          },
          {
            title: '是否会诊',
            dataIndex: 'isConsultation',
            render: (text, record) => (<span>{(text) ? '是' : '否'}</span>),
          },
          {
            title: '是否专家',
            dataIndex: 'isExpert',
            render: (text, record) => (<span>{(text) ? '是' : '否'}</span>),
          },
          {
            title: '特长',
            dataIndex: 'specialty',
            render: (text, record) => (<span>{text || '未填写'}</span>),
          },
          {
            title: '职称',
            dataIndex: 'title',
          },
          {
            title: '状态',
            dataIndex: 'status',
          },
          {
            title: '操作',
            key: 'operation',
            width: 44,
            className: 'operationColumn',
            render: (text, row, index) => {
              const operationMenu = (
                <Menu onClick={({ item, key, keyPath }) => { this.props.operation(item, key, keyPath, row.id); }}>
                  <Menu.Item key="0">下载文件</Menu.Item>
                  <Menu.Item key="1">
                    <a href="/device/edit" rel="noopener noreferrer" target="_blank">编辑</a>
                  </Menu.Item>
                  <Menu.Item key="2">复制外链</Menu.Item>
                  <Menu.Item key="3">删除文件</Menu.Item>
                </Menu>
              );

              return <Dropdown overlay={operationMenu} placement="bottomRight"><div>•••</div></Dropdown>;
            },
          },
        ]}
        headerOperates={<div><a href="/app/doctoredit" rel="noopener noreferrer" target="_blank">新增医生</a></div>}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleDeptTreeData: selectedOptions => handleDeptTreeData(dispatch, pagespace, selectedOptions),
    handleHospitalAllData: () => handleHospitalAllData(dispatch, pagespace),
    handleCascadAddr: () => handleCascadAddr(dispatch, pagespace, 'pcaCode'),
    // 表格行操作
    operation: (item, key, keyPath, id) => {
      console.log(item);
      console.log(key);
      console.log(keyPath);
      console.log(id);

      switch (key) {
        case '0':
          dispatch({
            type: `${pagespace}/tableSize`,
            payload: id,
          });
          break;
        default:
          break;
      }

      dispatch({
        type: `${pagespace}/recordRowClick`,
        payload: id,
      });
    },
  };
}

export default connect(null, mapDispatchToProps)(AppDoctor);
