import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

// antd 组件
import { Button, DatePicker, Table, Pagination } from 'antd';

// 内容国际化支持
import { FormattedMessage, FormattedNumber } from 'react-intl';
import pageWithIntl from '../../locales/PageWithIntl';

// 请求重试
import { retry } from '../../utils/requesterror';

// 本页样式
import styles from '../IndexPage.less';

const { MonthPicker, RangePicker } = DatePicker;

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

    return (
      <div className={styles.pageContainer}>
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
