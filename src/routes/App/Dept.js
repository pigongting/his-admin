import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'appdept';
const detailname = 'deptdetail';
const searchPlaceholder = '搜索科室...';

class AppDept extends React.Component {
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
            title: '科室名称',
            value: 'deptName',
          },
        ]}
        formItems={[
          {
            type: 'Cascader',
            field: 'mainDeptId',
            label: '父科室',
            width: 220,
            asynload: this.props.handleDeptTreeData,
            changeOnSelect: true,
          },
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
            title: '医院科室ID',
            dataIndex: 'hospitalDeptId',
            sorter: true,
          },
          {
            title: '科室名称',
            dataIndex: 'deptName',
          },
          {
            title: '简介',
            dataIndex: 'intro',
          },
          {
            title: '医院ID',
            dataIndex: 'hospitalId',
          },
          {
            title: '父科室ID',
            dataIndex: 'mainDeptId',
          },
          {
            title: '科室楼',
            dataIndex: 'deptFloor',
          },
          {
            title: '科室地址',
            dataIndex: 'deptAddress',
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
        headerOperates={<div><a href={`/${locale}/app/${detailname}`} rel="noopener noreferrer" target="_blank">新增科室</a></div>}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleDeptTreeData: () => dispatch({ type: `${pagespace}/fetchDeptTreeData` }),
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDept);
