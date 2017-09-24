import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

// antd 组件
import { DatePicker, Table } from 'antd';

// 内容国际化支持
import { FormattedMessage, FormattedNumber } from 'react-intl';
import pageWithIntl from '../locales/PageWithIntl';

// 请求重试
import { retry } from '../utils/requesterror';

// 本页样式
import styles from './IndexPage.css';


const { MonthPicker, RangePicker } = DatePicker;

// import { Button } from 'antd';
// <Button type="primary">Primary</Button>
// <Button>Default</Button>
// <Button type="dashed">Dashed</Button>
// <Button type="danger">Danger</Button>

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

    this.client = document.documentElement.getBoundingClientRect();
  }

  render() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }

    return (
      <div style={{ height: '100%' }}>
        <Table columns={this.props.pagedata.columns} dataSource={data} scroll={{ x: 2000, y: (this.client.height - 64 - 50 - 60) }} pagination={{ pageSize: 20 }} />
      </div>
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
  // console.log(state);
  return {
    loading: state.loading.effects['index/fetch'],
    pagedata: state.index,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(pageWithIntl(IndexPage));
