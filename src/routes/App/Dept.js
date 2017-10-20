import React from 'react';
import update from 'immutability-helper';
import moment from 'moment';
import { connect } from 'dva';
// antd 组件
import { Layout, Form, DatePicker, Dropdown, Input, Select, Menu } from 'antd';
// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const Option = Select.Option;

// 页内配置
const pageConfig = {
  namespace: 'appdept',
};

class AppDoctor extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);

    this.state = {
      columns: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { req, res, set } = this.props.pagedata;
    const { req: nextreq, res: nextres, set: nextset } = nextProps.pagedata;

    if (nextset.showColumns !== set.showColumns || nextres.rows !== res.rows) {
      const columns = [];
      nextset.showColumns.map((titleName) => {
        switch (titleName) {
          case '医院科室ID':
            columns.push({
              title: titleName,
              dataIndex: 'hospitalDeptId',
            });
            break;
          case '科室名称':
            columns.push({
              title: titleName,
              dataIndex: 'deptName',
            });
            break;
          case '科室简介':
            columns.push({
              title: titleName,
              dataIndex: 'intro',
            });
            break;
          case '医院ID':
            columns.push({
              title: titleName,
              dataIndex: 'hospitalId',
            });
            break;
          case '父科室':
            columns.push({
              title: titleName,
              dataIndex: 'mainDeptId',
            });
            break;
          case '楼层':
            columns.push({
              title: titleName,
              dataIndex: 'deptFloor',
            });
            break;
          case '科室地址':
            columns.push({
              title: titleName,
              dataIndex: 'deptAddress',
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

      this.setState(update(this.state, {
        columns: {
          $set: columns,
        },
      }));
    }
  }

  render() {
    const { columns } = this.state;
    const { pagedata, loading, locale, form } = this.props;
    const { req, res, set } = pagedata;
    const { getFieldDecorator } = form;

    return (
      <Form className="formTablePage" onSubmit={(e) => { this.props.submitForm(form, e); }}>
        <Layout className="tablePage">
          <Header className="tableHeader">
            <div className="search">
              <Form.Item>
                {getFieldDecorator('searchkey', {
                  rules: [{ required: true, message: 'Please input your E-mail!' }],
                })(<Select size="default">
                  <Option value="deptName">科室名称</Option>
                  <Option value="mobile">手机号码</Option>
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('searchvalue', {
                })(<Input size="default" placeholder="搜索医生..." onPressEnter={(e) => { this.props.submitForm(form); }} />)}
              </Form.Item>
            </div>
            <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
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
              <FormSubmitAndClear
                handleReset={this.props.handleReset}
                submitForm={this.props.submitForm}
                form={form}
              />
            </div>
            <FormTableAndPage
              namespace={pageConfig.namespace}
              rows={res.rows}
              columns={columns}
              fullcolumns={set.fullColumns}
              showcolumns={set.showColumns}
              current={req.page.index}
              pageSize={req.page.size}
              total={req.page.total}
              loading={loading}
            />
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
    submitForm: (form, e) => {
      if (e) { e.preventDefault(); }
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormFillter`,
        payload: form.getFieldsValue(),
      });
      // 发送请求
      dispatch({
        type: `${pageConfig.namespace}/fetchTableData`,
        payload: { index: 1 },
      });
    },
    // 清除所有筛选条件后提交筛选表单
    handleReset: (form, submitForm) => {
      form.resetFields(['searchvalue']);
      submitForm(form);
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
    pagedata: state[pageConfig.namespace],
    loading: state.loading.effects[`${pageConfig.namespace}/fetchTableData`],
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
