import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

// antd 组件
import { Layout, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon } from 'antd';

// 内容国际化支持
import { FormattedMessage, FormattedNumber } from 'react-intl';
import pageWithIntl from '../locales/PageWithIntl';

// 请求重试
import { retry } from '../utils/requesterror';

// 本页样式
import styles from './IndexPage.css';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

function onChange(date, dateString) {
  console.log(date, dateString);
}

class IndexPage extends React.Component {
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
        name: 'ZMY002',
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
      <Layout>
        <Header className={styles.tableSpecHeader}>
          <div className="search">
            <InputGroup compact>
              <Select defaultValue="Zhejiang">
                <Option value="Zhejiang">设备号</Option>
                <Option value="Jiangsu">维护人员</Option>
              </Select>
              <Input
                style={{ width: '240px' }}
                placeholder="搜索设备..."
                onPressEnter={(e) => {
                  console.log(e.target.value);
                  return 1;
                }}
              />
            </InputGroup>
          </div>
          <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
          <div className="pagination">
            <Pagination
              total={85}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              pageSize={20}
              defaultCurrent={1}
            />
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Button className="tableSet" style={{ marginLeft: 8 }}>
                <i className="tableSetIcon" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.scrollContainer}>
          <div className="fillter">
            <div className="fillter-title">筛选项</div>
            <div className="fillter-operate">
              <Button type="primary">开始筛选</Button>&emsp;
              <Button>清空</Button>
            </div>
            <div>
              <span>申请时间：</span>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Start Time', 'End Time']}
                onChange={onChange}
              />
            </div>
          </div>
          <Table columns={this.props.pagedata.columns} dataSource={data} size="middle" pagination={false} />
          <div className="fullPagination">
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
    loading: state.loading.effects['index/fetch'],
    pagedata: state.index,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(pageWithIntl(IndexPage));
