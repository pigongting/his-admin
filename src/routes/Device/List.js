import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import cs from 'classnames';

// antd 组件
import { notification, Layout, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';

// 请求重试
import { retry } from '../../utils/requesterror';

// 本页样式
import styles from './List.less';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class DeviceList extends React.Component {
  constructor(props) {
    super(props);

    // if (typeof window !== 'undefined') {
    //   import(/* webpackChunkName: "lodash" */ 'lodash')
    //   .then(_ => {
    //     console.log(149174);
    //   })
    //   .catch(err => console.log('Failed to load moment', err));
    // }
  }

  componentWillMount() {
    const { req, res, set } = this.props.pagedata;

    if (set.tableColumns.length < 1) {
      this.props.setTableColumns();
    }
  }

  componentDidUpdate() {
    const { errorType } = this.props.pagedata;

    if (errorType) {
      const openkey = `open${Date.now()}`;
      let notify = {};

      switch (errorType) {
        case 'devicelist/fetch':
          notify = {
            message: '表格数据请求失败',
            description: '是否重试',
            duration: 0,
            key: openkey,
            btn: (<Button type="primary" size="small" onClick={() => this.props.startRetry(openkey)}>确定</Button>),
          };
          break;
        case 'devicelist/batchDelete':
          notify = {
            message: '删除失败',
            description: '是否重试',
            duration: 0,
            key: openkey,
            btn: (<Button type="primary" size="small" onClick={() => this.props.startRetry(openkey)}>确定</Button>),
          };
          break;
        default:
          break;
      }

      notification.error(notify);
      this.props.clearError(errorType);
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
        case '商户编号':
          columns.push({
            title: titleName,
            dataIndex: 'comp_id',
            colSpan: 2,
          });
          break;
        case '商户名称':
          columns.push({
            title: titleName,
            dataIndex: 'partner_no',
            colSpan: 0,
            render: (text, row, index) => {
              const obj = {
                children: text,
                props: {},
              };

              if (index === 4) {
                obj.props.colSpan = 2;
              }

              return obj;
            },
          });
          break;
        case '渠道来源':
          columns.push({
            title: titleName,
            dataIndex: 'comp_ctag_name',
            render: (text, row, index) => {
              const obj = {
                children: text,
                props: {},
              };

              if (index === 2) {
                obj.props.rowSpan = 2;
              }

              if (index === 3) {
                obj.props.rowSpan = 0;
              }

              if (index === 4) {
                obj.props.colSpan = 0;
              }

              return obj;
            },
            sorter: true,
            sortOrder: req.orders.comp_ctag_name ? req.orders.comp_ctag_name[1] : false,
          });
          break;
        case '类别':
          columns.push({
            title: titleName,
            dataIndex: 'channel_id',
            filters: res.filters.channel_id,
            filteredValue: req.tableFilters.channel_id ? req.tableFilters.channel_id[1] : [],
            filterMultiple: false,
          });
          break;
        case '联系电话':
          columns.push({
            title: titleName,
            dataIndex: 'cat_name',
            filters: res.filters.cat_name,
            filteredValue: req.tableFilters.cat_name ? req.tableFilters.cat_name[1] : [],
            filterMultiple: false,
          });
          break;
        case '联系人':
          columns.push({
            title: titleName,
            dataIndex: 'comp_phone',
          });
          break;
        case '地址':
          columns.push({
            title: titleName,
            dataIndex: 'comp_addr',
          });
          break;
        case '排序权重':
          columns.push({
            title: titleName,
            dataIndex: 'comp_order',
            sorter: true,
            sortOrder: req.orders.comp_order ? req.orders.comp_order[1] : false,
          });
          break;
        case '登录账号管理':
          columns.push({
            title: titleName,
            dataIndex: 'partner_admin_num',
          });
          break;
        case '二级域名管理':
          columns.push({
            title: titleName,
            dataIndex: 'domain',
          });
          break;
        case '状态':
          columns.push({
            title: titleName,
            dataIndex: 'comp_status_html',
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
      <Layout className={styles.tablePage}>
        <Header className={styles.tableHeader}>
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
              wrapClassName={styles.columnModal}
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
          <div className={styles.tableFillter}>
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
              <div className={cs(styles.batchOperation, set.tableSize)}>
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
          <div className={styles.tablePagination}>
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
    setMenu: ({ item, key, keyPath }) => {
      switch (key) {
        case '0':
          dispatch({
            type: 'devicelist/tableSize',
            payload: 'default',
          });
          break;
        case '1':
          dispatch({
            type: 'devicelist/tableSize',
            payload: 'middle',
          });
          break;
        case '2':
          dispatch({
            type: 'devicelist/tableSize',
            payload: 'small',
          });
          break;
        case '3':
          dispatch({
            type: 'devicelist/columnModalVisible',
          });
          break;
        default:
          break;
      }
    },
    operation: (item, key, keyPath, id) => {
      console.log(item);
      console.log(key);
      console.log(keyPath);
      console.log(id);

      switch (key) {
        case '0':
          dispatch({
            type: 'devicelist/tableSize',
            payload: id,
          });
          break;
        default:
          break;
      }

      dispatch({
        type: 'devicelist/recordRowClick',
        payload: id,
      });
    },
    pageChange: (page, pageSize) => {
      dispatch({
        type: 'devicelist/fetch',
        payload: {
          index: page,
          size: pageSize,
        },
      });
    },
    applyTimeChange: (dates, dateStrings) => {
      dispatch({
        type: 'devicelist/applyTimeChange',
        payload: dateStrings,
      });
    },
    searchSelect: (value, option) => {
      dispatch({
        type: 'devicelist/searchSelect',
        payload: value,
      });
    },
    searchFillter: (e) => {
      dispatch({
        type: 'devicelist/searchFillter',
        payload: e.target.value,
      });
    },
    startFillter: (e) => {
      dispatch({
        type: 'devicelist/fetch',
        payload: {
          index: 1,
        },
      });
    },
    clearFillter: (e) => {
      dispatch({
        type: 'devicelist/clearFillter',
      });
    },
    tableChange: (pagination, filters, sorter) => {
      console.log(filters, sorter);
      dispatch({
        type: 'devicelist/tableChange',
        payload: {
          filter: filters,
          orders: sorter,
        },
      });
      dispatch({
        type: 'devicelist/fetch',
        payload: {
          index: 1,
        },
      });
    },
    rowSelectionHandler: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'devicelist/rowSelected',
        payload: selectedRowKeys,
      });
    },
    batchDelete: () => {
      dispatch({
        type: 'devicelist/batchDelete',
      });
    },
    columnModalHide: (e) => {
      dispatch({
        type: 'devicelist/columnModalVisible',
      });
    },
    setTableColumns: (checkedValue) => {
      dispatch({
        type: 'devicelist/setTableColumns',
        payload: checkedValue,
      });
    },
    reload: () => {
      dispatch({
        type: 'devicelist/fetch',
      });
    },
    clearError: (errorType) => {
      dispatch({
        type: 'devicelist/clearerror',
        payload: errorType,
      });
    },
    startRetry: (openkey) => {
      notification.close(openkey);
      retry(dispatch);
    },
    rowClick: (record, index, event) => {
      dispatch({
        type: 'devicelist/recordRowClick',
        payload: record.key,
      });
    },
    rowClicked: (record, index, clickedArray) => {
      return (clickedArray.includes(record.key)) ? 'clicked' : '';
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.effects['devicelist/fetch'],
    pagedata: state.devicelist,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList);
