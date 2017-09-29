import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

// antd 组件
import { Layout, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon } from 'antd';

// 请求重试
import { retry } from '../utils/requesterror';

// 本页样式
import styles from './Index.less';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

function onChange(date, dateString) {
  console.log(date, dateString);
}

class Index extends React.Component {
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

  render() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `ZMY00${i}`,
        age: '猫猫奶茶',
        address: `自主申请 ${i}`,
      });
    }

    const menu = (
      <Menu>
        <ItemGroup title="显示密度">
          <Menu.Item key="0">
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">标准</a>
          </Menu.Item>
          <Menu.Item key="1">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">适中</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">紧凑</a>
          </Menu.Item>
        </ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );

    return (
      <Layout className={styles.tablePage}>
        <Header className={styles.tableHeader}>
          <div className="search">
            <InputGroup>
              <Select defaultValue="Zhejiang">
                <Option value="Zhejiang">设备号</Option>
                <Option value="Jiangsu">维护人员</Option>
              </Select>
              <Input style={{ width: '240px' }} placeholder="搜索设备..." onPressEnter={(e) => { return 1; }} />
            </InputGroup>
          </div>
          <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
          <div className="pagination">
            <Pagination total={85} pageSize={20} defaultCurrent={1} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} />
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ overflowY: 'auto', padding: '0 10px 0 16px' }}>
          <div className={styles.tableFillter}>
            <div className="fillterTitle">筛选项</div>
            <div className="fillterItem">
              <span>申请时间：</span>
              <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} onChange={onChange} style={{ width: 240 }} />
            </div>
            <div className="fillterOperate"><Button type="primary">开始筛选</Button>&emsp;<Button>清空</Button></div>
          </div>
          <Table
            columns={this.props.pagedata.columns}
            dataSource={data}
            size="middle"
            pagination={false}
            loading={{
              delay: 3000,
            }}
            rowSelection={{
              type: 'checkbox',
              getCheckboxProps: (record) => {
                return {
                  disabled: record.name === 'ZMY002',
                };
              },
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('-------------onChange--------------');
                console.log(selectedRowKeys);
                console.log(selectedRows);
              },
              onSelect: (record, selected, selectedRows) => {
                console.log('-------------onSelect--------------');
                console.log(record);
                console.log(selected);
                console.log(selectedRows);
              },
              onSelectAll: (selected, selectedRows, changeRows) => {
                console.log('-------------onSelectAll--------------');
                console.log(selected);
                console.log(selectedRows);
                console.log(changeRows);
              },
              onSelectInvert: (selectedRows) => {
                console.log('-------------onSelectInvert--------------');
                console.log(selectedRows);
              },
              selections: [{
                key: '0',
                text: 'pgt',
                onSelect: (changeableRowKeys) => {
                  console.log('-------------selections - onSelect--------------');
                  console.log(changeableRowKeys);
                },
              }, {
                key: '1',
                text: '还算',
                onSelect: (changeableRowKeys) => {
                  console.log('-------------selections - onSelect--------------');
                  console.log(changeableRowKeys);
                },
              }],
              hideDefaultSelections: true,
            }}
          />
          <div className={styles.tablePagination}>
            <Pagination showSizeChanger showQuickJumper defaultCurrent={3} total={500} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} />
          </div>
        </Content>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onRetry: () => {
      console.log('456456');
      retry(dispatch);
    },
  };
}

function mapStateToProps(state, ownProps) {
  // console.log('state>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(state);
  return {
    loading: state.loading.effects['device/fetch'],
    pagedata: state.device,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
