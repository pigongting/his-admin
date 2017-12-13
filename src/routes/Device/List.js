import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'devicemachine';
const detailname = 'devicemachinedetail';
const searchPlaceholder = '搜索机器...';

class DeviceMachine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { locale } = this.props;

    return (
      <FormTablePage
        namespace={pagespace}
        searchPlaceholder={searchPlaceholder}
        searchOptions={[
          {
            title: '机器名称',
            value: 'deptName',
          },
        ]}
        formItems={[
          {
            type: 'RangePicker',
            field: 'createDt',
            label: '创建时间',
          },
        ]}
        rowSelection={{
          type: 'checkbox',
          selections: true,
        }}
        columns={[
          {
            title: '设备编号',
            dataIndex: 'mcode',
            sorter: true,
          },
          {
            title: '型号名称',
            dataIndex: 'modelCode',
          },
          {
            title: '型号名称',
            dataIndex: 'modelName',
          },
          {
            title: '安装位置',
            dataIndex: 'position',
          },
          {
            title: '铺设负责人',
            dataIndex: 'layingDirectorName',
          },
          {
            title: '维护负责人',
            dataIndex: 'supervisorName',
          },
          {
            title: '状态',
            dataIndex: 'state',
          },
          {
            title: '操作',
            key: 'operation',
            render: (text, row, index) => {
              const operationMenu = (
                <Menu onClick={({ item, key, keyPath }) => { this.props.handleOperation(item, key, keyPath, row.id); }}>
                  <Menu.Item key="0"><a href={`/${locale}/app/${detailname}?id=${row.id}`} rel="noopener noreferrer" target="_blank">查看</a></Menu.Item>
                  <Menu.Item key="1"><a href={`/${locale}/app/${detailname}?id=${row.id}&edit=1`} rel="noopener noreferrer" target="_blank">编辑</a></Menu.Item>
                  <Menu.Item key="2">删除</Menu.Item>
                </Menu>
              );
              return <Dropdown overlay={operationMenu} placement="bottomRight"><div>•••</div></Dropdown>;
            },
          },
        ]}
        headerOperates={<div><a href={`/${locale}/app/${detailname}`} rel="noopener noreferrer" target="_blank">新增机器</a></div>}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleOperation: (item, key, keyPath, id) => {
      switch (key) {
        case '2':
          dispatch({ type: `${pagespace}/fetchDeleteRow`, payload: [id] });
          break;
        default:
          break;
      }

      dispatch({ type: `${pagespace}/recordClickedRow`, payload: id });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return { locale: state.ssr.locale };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMachine);
