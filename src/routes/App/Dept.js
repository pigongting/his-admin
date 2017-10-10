import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import cs from 'classnames';
// antd 组件
import { notification, Layout, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';
// 配置
import { errorDesc, retryErrorType } from '../../../config/config';
// 请求重试
import { retry } from '../../utils/requesterror';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

// 页内配置
const pageConfig = {
  namespace: 'appdept',
};

class AppDept extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { req, res, set } = this.props.pagedata;

    if (set.tableColumns.length < 1) {
      this.props.setTableColumns();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { errorAction, errorType } = nextProps.pagedata;
    console.log(errorAction);
    // 错误提示
    if (errorAction) {
      const openkey = `open${Date.now()}`;
      const notify = {
        key: openkey,
        description: errorDesc[errorType],
      };
      // 可以重试的错误类型
      if (retryErrorType.includes(errorType)) {
        notify.duration = 0;
        notify.btn = (<Button type="primary" size="small" onClick={() => this.props.startRetry(openkey)}>确定</Button>);
      }
      // 不同的请求不同的错误标题
      switch (errorAction) {
        case `${pageConfig.namespace}/fetch`:
          notify.message = '表格数据请求失败';
          break;
        case `${pageConfig.namespace}/batchDelete`:
          notify.message = '删除失败';
          break;
        default:
          break;
      }
      // 显示错误提示
      notification.error(notify);
      // 显示过后清除错误
      this.props.clearError(errorAction);
    }
  }

  render() {
    const { req, res, set } = this.props.pagedata;

    // 表格设置下拉列表
    const menu = (
      <Menu onClick={this.props.setMenu}>
        <ItemGroup title="显示密度">
          <Menu.Item key="0" className={(set.tableSize === 'default') ? 'checkmark' : ''}>标准</Menu.Item>
          <Menu.Item key="1" className={(set.tableSize === 'middle') ? 'checkmark' : ''}>适中</Menu.Item>
          <Menu.Item key="2" className={(set.tableSize === 'small') ? 'checkmark' : ''}>紧凑</Menu.Item>
        </ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );

    // 表格列
    const columns = [];
    set.tableColumns.map((titleName) => {
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

    return (
      <Layout className="tablePage">
        <Header className="tableHeader">
          <div className="search">
            <InputGroup>
              <Select value={req.search.key} onSelect={this.props.searchSelect}>
                <Option value="device_name">设备号</Option>
                <Option value="men_name">维护人员</Option>
              </Select>
              <Input
                style={{ width: '240px' }}
                placeholder="搜索设备..."
                value={req.search.value ? req.search.value[1] : null}
                onChange={this.props.searchFillter}
                onPressEnter={this.props.startFillter}
              />
            </InputGroup>
          </div>
          <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
          <div className="pagination">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={20}
              current={req.page.index}
              pageSize={req.page.size}
              total={req.page.total}
              showTotal={(total, range) => {
                return `${range[0]}-${range[1]} of ${total} items`;
              }}
              onChange={this.props.pageChange}
            />
            <Button className="tableReload" style={{ marginLeft: 8 }} onClick={this.props.reload}><i className="tableReloadIcon" /></Button>
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
            </Dropdown>
            <Modal
              title="配置表格列"
              visible={set.columnModal.visible}
              onCancel={this.props.columnModalHide}
              footer={null}
              wrapClassName="columnModal"
            >
              <Checkbox.Group value={set.tableColumns} onChange={this.props.setTableColumns}>
                <Row>
                  {set.fullColumns.map((item, index) => {
                    return (
                      <Col key={index} span={8}><Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox></Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </Modal>
          </div>
        </Header>
        <Content style={{ overflowY: 'auto', padding: '0 10px 0 16px' }}>
          <div className="tableFillter">
            <div className="fillterTitle">筛选项</div>
            <div className="fillterItem">
              <span>申请时间：</span>
              <RangePicker
                value={(req.filters.apply_time) ? [moment(req.filters.apply_time[1][0]), moment(req.filters.apply_time[1][1])] : null}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
                onChange={this.props.applyTimeChange}
              />
            </div>
            <div className="fillterOperate">
              <Button type="primary" onClick={this.props.startFillter}>开始筛选</Button>
              &emsp;
              <Button onClick={this.props.clearFillter}>清空</Button>
            </div>
          </div>
          {
            (set.tableSelected.length > 0) ?
              <div className={cs('batchOperation', set.tableSize)}>
                <Button type="danger" onClick={this.props.batchDelete} icon="delete" autoFocus>删除</Button>
              </div>
            : null
          }
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: set.tableSelected,
              onChange: this.props.rowSelectionHandler,
              selections: true,
            }}
            pagination={false}
            size={set.tableSize}
            dataSource={res.rows}
            columns={columns}
            rowClassName={(record, index) => { return this.props.rowClicked(record, index, set.rowClicked); }}
            onChange={this.props.tableChange}
            loading={{
              size: 'default',
              spinning: this.props.loading,
              tip: 'loading',
              wrapperClassName: 'aaaa',
            }}
            locale={{
              filterTitle: '筛选',
              filterConfirm: '确定',
              filterReset: '重置',
              emptyText: '暂无数据',
            }}
            onRowClick={this.props.rowClick}
          />
          <div className="tablePagination">
            <Pagination
              showSizeChanger
              showQuickJumper
              defaultCurrent={1}
              defaultPageSize={20}
              current={req.page.index}
              pageSize={req.page.size}
              total={req.page.total}
              showTotal={(total, range) => {
                return `${range[0]}-${range[1]} of ${total} items`;
              }}
              onChange={this.props.pageChange}
              onShowSizeChange={this.props.pageChange}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // 每个页面都有这 2 个，而且内容都一样
    // 清除错误
    clearError: (errorAction) => {
      dispatch({
        type: `${pageConfig.namespace}/clearerror`,
        payload: errorAction,
      });
    },
    // 重试请求
    startRetry: (openkey) => {
      notification.close(openkey);
      retry(dispatch);
    },
    // 头部
    // 选择搜索项
    searchSelect: (value, option) => {
      dispatch({
        type: `${pageConfig.namespace}/searchSelect`,
        payload: value,
      });
    },
    // 设置搜索关键字
    searchFillter: (e) => {
      dispatch({
        type: `${pageConfig.namespace}/searchFillter`,
        payload: e.target.value,
      });
    },
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
    // 判断行是否被点击过
    rowClicked: (record, index, clickedArray) => {
      return (clickedArray.includes(record.key)) ? 'clicked' : '';
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
    // 表单筛选
    // 清除所有筛选条件
    clearFillter: (e) => {
      dispatch({
        type: `${pageConfig.namespace}/clearFillter`,
      });
    },
    // 开始表单筛选
    startFillter: (e) => {
      dispatch({
        type: `${pageConfig.namespace}/fetch`,
        payload: {
          index: 1,
        },
      });
    },
    // 设置筛选时间段
    applyTimeChange: (dates, dateStrings) => {
      dispatch({
        type: `${pageConfig.namespace}/applyTimeChange`,
        payload: dateStrings,
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDept);
