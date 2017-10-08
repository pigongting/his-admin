import React from 'react';
import moment from 'moment';
import cs from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';
// antd 组件
import { notification, Layout, Form, Input, Button, Tooltip, Icon, Cascader } from 'antd';
// 请求重试
import { retry } from '../../utils/requesterror';
// 本页样式
import styles from './Edit.less';

// antd 组件扩展
const { Header, Content } = Layout;

// 表单布局
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

class DeviceEdit extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
  }

  componentDidUpdate() {
    const { errorType } = this.props.pagedata;

    if (errorType) {
      const openkey = `open${Date.now()}`;
      let notify = {};

      switch (errorType) {
        case 'deviceedit/batchDelete':
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
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout className={styles.tablePage}>
        <Header className={styles.tableHeader}>
          <div className="pageTitle">新增设备</div>
        </Header>
        <Content className={styles.EditForm} style={{ overflowY: 'auto', padding: '0 10px 0 16px' }}>
          <Form onSubmit={(e) => { this.props.submitForm(e, this.props); }}>
            <Form.Item
              {...formItemLayout}
              label={(
                <span>
                  用户名&nbsp;
                  <Tooltip title="What do you want other to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              extra="文件客户端缓存 maxAge"
              hasFeedback
            >
              {
                getFieldDecorator('username', {
                  rules: [
                    {
                      type: 'email', message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true, message: 'Please input your E-mail!',
                    },
                  ],
                })(<Input />)
              }
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="密码"
              hasFeedback
            >
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      required: true, message: 'Please input your password!',
                    },
                  ],
                })(<Input type="password" />)
              }
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="地址"
            >
              {
                getFieldDecorator('residence', {
                  initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                  rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                })(<Cascader options={residences} />)
              }
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    startRetry: (openkey) => {
      notification.close(openkey);
      retry(dispatch);
    },
    clearError: (errorType) => {
      dispatch({
        type: 'deviceedit/clearerror',
        payload: errorType,
      });
    },
    submitForm: (e, props) => {
      e.preventDefault();
      // console.log(e);
      console.log(props.form.getFieldsValue());

      dispatch({
        type: 'deviceedit/batchDelete',
      });

      // props.form.validateFields((err, values) => {
      //   console.log('Received values of err: ', err);
      //   console.log('Received values of form: ', values);
      // });

      // dispatch({
      //   type: 'deviceedit/updateReq',
      //   payload: changedFields,
      // });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.effects['deviceedit/fetch'],
    pagedata: state.deviceedit,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    console.log(props);
    const req = props.pagedata.req;
    return {
      username: {
        value: req.username.value,
      },
      password: {
        value: req.password.value,
      },
    };
  },
})(DeviceEdit));
