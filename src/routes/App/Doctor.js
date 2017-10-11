import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
// antd 组件
import { notification, Layout, Form, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';
// 自定义组件
import FormTableHeader from '../../components/FormTableHeader';
import FormTableAndPage from '../../components/FormTableAndPage';
import FormSubmitAndClear from '../../components/FormSubmitAndClear';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

// 页内配置
const pageConfig = {
  namespace: 'appdoctor',
};

class AppDoctor extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);
  }

  render() {
    const { req, res, set } = this.props.pagedata;
    const { getFieldDecorator } = this.props.form;

    // 表格列
    const columns = [];
    set.tableColumns.map((titleName) => {
      switch (titleName) {
        case '医生名称':
          columns.push({
            title: titleName,
            dataIndex: 'doctorName',
            sorter: true,
            sortOrder: req.orders.doctorName ? req.orders.doctorName[1] : false,
          });
          break;
        case '医生头衔':
          columns.push({
            title: titleName,
            dataIndex: 'doctorCap',
          });
          break;
        case '手机号码':
          columns.push({
            title: titleName,
            dataIndex: 'mobile',
          });
          break;
        case '是否会诊':
          columns.push({
            title: titleName,
            dataIndex: 'isConsultation',
            render: (text, record) => (<span>{(text) ? '是' : '否'}</span>),
          });
          break;
        case '是否专家 ':
          columns.push({
            title: titleName,
            dataIndex: 'isExpert',
            render: (text, record) => (<span>{(text) ? '是' : '否'}</span>),
          });
          break;
        case '特长':
          columns.push({
            title: titleName,
            dataIndex: 'specialty',
            render: (text, record) => (<span>{text || '未填写'}</span>),
          });
          break;
        case '职称':
          columns.push({
            title: titleName,
            dataIndex: 'title',
          });
          break;
        case '状态':
          columns.push({
            title: titleName,
            dataIndex: 'status',
          });
          break;
        default:
          break;
      }
      return columns;
    });

    columns.push({
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

        return (
          <Dropdown overlay={operationMenu} placement="bottomRight">
            <div>•••</div>
          </Dropdown>
        );
      },
    });

    return (
      <Form className="formTablePage" onSubmit={(e) => { this.props.submitForm(e, this.props); }}>
        <Layout className="tablePage">
          <Header className="tableHeader">
            <div className="search">
              <Form.Item>
                {getFieldDecorator('searchkey', {
                  rules: [{ required: true, message: 'Please input your E-mail!' }],
                })(<Select size="default">
                  <Option value="doctorName">医生名称</Option>
                  <Option value="mobile">手机号码</Option>
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('searchvalue', {
                })(<Input size="default" placeholder="搜索医生..." onPressEnter={(e) => { this.props.submitForm(e, this.props); }} />)}
              </Form.Item>
            </div>
            <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
            <FormTableHeader pageprops={this.props} />
          </Header>
          <Content className="tableContent">
            <div className="tableFillter">
              <div className="fillterTitle">筛选项</div>
              <Form.Item label="申请时间">
                {getFieldDecorator('createDt', {
                })(<RangePicker
                  size="default"
                  placeholder={['开始时间', '结束时间']}
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </Form.Item>
              <FormSubmitAndClear pageprops={this.props} />
            </div>
            <FormTableAndPage pageprops={this.props} pagecolumns={columns} />
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // 表单筛选
    // 提交筛选表单
    submitForm: (e, props) => {
      e.preventDefault();
      dispatch({
        type: `${pageConfig.namespace}/updateFormFillter`,
        payload: props.form.getFieldsValue(),
      });
      dispatch({
        type: `${pageConfig.namespace}/fetch`,
        payload: { index: 1 },
      });
    },
    // 清除所有筛选条件后提交筛选表单
    handleReset: (e, props) => {
      props.form.resetFields(['searchvalue']);
      props.submitForm(e, props);
    },
    // 头部
    // 切换分页
    pageChange: (page, pageSize) => {
      dispatch({
        type: `${pageConfig.namespace}/fetch`,
        payload: {
          index: page,
          size: pageSize,
        },
      });
    },
    // 重载当前页
    reload: () => {
      dispatch({
        type: `${pageConfig.namespace}/fetch`,
      });
    },
    // 表格设置
    setMenu: ({ item, key, keyPath }) => {
      switch (key) {
        case '0':
          dispatch({
            type: `${pageConfig.namespace}/tableSize`,
            payload: 'default',
          });
          break;
        case '1':
          dispatch({
            type: `${pageConfig.namespace}/tableSize`,
            payload: 'middle',
          });
          break;
        case '2':
          dispatch({
            type: `${pageConfig.namespace}/tableSize`,
            payload: 'small',
          });
          break;
        case '3':
          dispatch({
            type: `${pageConfig.namespace}/columnModalVisible`,
          });
          break;
        default:
          break;
      }
    },
    // 显示隐藏表格列设置模态框
    columnModalHide: (e) => {
      dispatch({
        type: `${pageConfig.namespace}/columnModalVisible`,
      });
    },
    // 设置显示的表格列
    setTableColumns: (checkedValue) => {
      dispatch({
        type: `${pageConfig.namespace}/setTableColumns`,
        payload: checkedValue,
      });
    },
    // 表格
    // 当前选中的行
    rowSelectionHandler: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: `${pageConfig.namespace}/rowSelected`,
        payload: selectedRowKeys,
      });
    },
    // 删除当前选中的行
    batchDelete: () => {
      dispatch({
        type: `${pageConfig.namespace}/batchDelete`,
      });
    },
    // 点击表格行
    rowClick: (record, index, event) => {
      dispatch({
        type: `${pageConfig.namespace}/recordRowClick`,
        payload: record.key,
      });
    },
    // 表格自带筛选，排序
    tableChange: (pagination, filters, sorter) => {
      console.log(filters, sorter);
      dispatch({
        type: `${pageConfig.namespace}/tableChange`,
        payload: {
          filter: filters,
          orders: sorter,
        },
      });
      dispatch({
        type: `${pageConfig.namespace}/fetch`,
        payload: {
          index: 1,
        },
      });
    },
    // 表格行操作
    operation: (item, key, keyPath, id) => {
      console.log(item);
      console.log(key);
      console.log(keyPath);
      console.log(id);

      switch (key) {
        case '0':
          dispatch({
            type: `${pageConfig.namespace}/tableSize`,
            payload: id,
          });
          break;
        default:
          break;
      }

      dispatch({
        type: `${pageConfig.namespace}/recordRowClick`,
        payload: id,
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.effects[`${pageConfig.namespace}/fetch`],
    pagedata: state[pageConfig.namespace],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const req = props.pagedata.req;
    return {
      searchkey: {
        value: req.search.key,
      },
      searchvalue: {
        value: req.search.value[1][0],
      },
      createDt: {
        value: (req.filters.createDt) ? [moment(req.filters.createDt[1][0]), moment(req.filters.createDt[1][1])] : null,
      },
    };
  },
})(AppDoctor));
