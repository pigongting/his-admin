import React from 'react';
import moment from 'moment';
import cs from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';
// antd 组件
import { notification, Layout, Form, Input, Button, Tooltip, Icon, Cascader } from 'antd';
// 请求重试
import { retry } from '../utils/requesterror';
// 本页样式
import styles from './Login.less';

// antd 组件扩展
const { Header, Content } = Layout;

class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  componentDidUpdate() {
    const { errorAction, errorType } = this.props.pagedata;

    if (errorAction) {
      const openkey = `open${Date.now()}`;
      let notify = {};

      switch (errorAction) {
        case 'login/batchDelete':
          console.log(errorType);
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
      this.props.clearError(errorAction);
    }
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    return (
      <Layout className={styles.loginPage}>
        <Header className={styles.loginHeader}>
          <div className={styles.logo}>
            <img src="/assets/img/brand/logoLogin.png" alt="logo" />
          </div>
        </Header>
        <Content className={styles.loginContent}>
          <div className={styles.formWarp}>
            <div className={styles.formBox}>
              <Form onSubmit={(e) => { this.props.submitForm(e, this.props); }}>
                <Form.Item
                  validateStatus={usernameError ? 'error' : ''}
                  help={usernameError || ''}
                >
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />,
                  )}
                </Form.Item>
                <Form.Item
                  validateStatus={passwordError ? 'error' : ''}
                  help={passwordError || ''}
                >
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />,
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    className={styles.submitButton}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    disabled={this.props.hasErrors(getFieldsError())}
                  >登录</Button>
                </Form.Item>
              </Form>
            </div>
            <p className={styles.copyright}>Power by Java - © 2017 某某医院 版权所有</p>
          </div>
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
    clearError: (errorAction) => {
      dispatch({
        type: 'login/clearerror',
        payload: errorAction,
      });
    },
    hasErrors: (fieldsError) => {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    submitForm: (e, props) => {
      e.preventDefault();
      // console.log(e);
      console.log(props.form.getFieldsValue());

      dispatch({
        type: 'login/batchDelete',
      });

      // props.form.validateFields((err, values) => {
      //   console.log('Received values of err: ', err);
      //   console.log('Received values of form: ', values);
      // });

      // dispatch({
      //   type: 'login/updateReq',
      //   payload: changedFields,
      // });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.effects['login/fetch'],
    pagedata: state.login,
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
})(Login));
