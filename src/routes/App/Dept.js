import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'appdept';
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
          {
            title: '手机号码',
            value: 'mobile',
          },
        ]}
        formItems={[]}
        rowSelection={{
          type: 'checkbox',
          selections: true,
        }}
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
            filters: [{
              text: '是',
              value: true,
            }, {
              text: '否',
              value: false,
            }],
          },
          {
            title: '是否专家',
            dataIndex: 'isExpert',
            render: (text, record) => (<span>{(text) ? '是' : '否'}</span>),
            filters: [{
              text: '是',
              value: true,
            }, {
              text: '否',
              value: false,
            }],
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
            render: (text, row, index) => {
              const operationMenu = (
                <Menu onClick={({ item, key, keyPath }) => { this.props.handleOperation(item, key, keyPath, row.id); }}>
                  <Menu.Item key="0"><a href={`/${locale}/app/doctoredit?id=${row.id}`} rel="noopener noreferrer" target="_blank">查看</a></Menu.Item>
                  <Menu.Item key="1"><a href={`/${locale}/app/doctoredit?id=${row.id}&edit=1`} rel="noopener noreferrer" target="_blank">编辑</a></Menu.Item>
                  <Menu.Item key="2">删除</Menu.Item>
                </Menu>
              );
              return <Dropdown overlay={operationMenu} placement="bottomRight"><div>•••</div></Dropdown>;
            },
          },
        ]}
        headerOperates={<div><a href={`/${locale}/app/doctoredit`} rel="noopener noreferrer" target="_blank">新增医生</a></div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDept);
