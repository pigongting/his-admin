import React from 'react';
import { connect } from 'dva';
// antd 组件
import { Form, Layout, Button, Input, Select, Cascader, Radio, DatePicker } from 'antd';
// 表单布局
import { formItemLayout, tailFormItemLayout } from '../../config/formConfig';
// antd 组件扩展
const { Header, Content } = Layout;
const { TextArea } = Input;

class FormPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { form, namespace, pagedata, pagetitle, itemdata } = this.props;
    const { res } = pagedata;
    const { getFieldDecorator } = form;

    const formitem = () => {
      const formItemNode = [];

      itemdata.map((item, index) => {
        switch (item.type) {
          case 'FormItemGroup':
            formItemNode.push(<div key={index} className="formGroup">{item.label}</div>);
            break;
          case 'Input':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label} hasFeedback>
              {
                getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                    { pattern: item.pattern || false, message: item.patternmsg },
                  ],
                })(<Input />)
              }
            </Form.Item>);
            break;
          case 'TextArea':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label} hasFeedback>
              {
                getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                    { pattern: item.pattern || false, message: item.patternmsg },
                  ],
                })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)
              }
            </Form.Item>);
            break;
          case 'Select':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                  ],
                })(<Select
                  placeholder="请选择"
                  notFoundContent="加载中..."
                  onFocus={(res[item.field]) ? () => {} : () => { item.asynload(form); }}
                  getPopupContainer={() => document.getElementById('formScrollContent')}
                >
                  {res[item.field] && res[item.field].map((ele, i) =>
                    <Select.Option key={i} value={`${ele[item.field]}`}>{ele[item.name]}</Select.Option>,
                  )}
                </Select>)
              }
            </Form.Item>);
            break;
          case 'Cascader':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {getFieldDecorator(item.field, {
                rules: [
                  { required: item.required || false, message: item.requiredmsg },
                ],
              })(<Cascader
                getPopupContainer={() => document.getElementById('formScrollContent')}
                placeholder="请选择"
                options={res[item.field]}
                loadData={selectedOptions => item.asynload(form, selectedOptions)}
                onPopupVisibleChange={(res[item.field][0].value === '') ? (selectedOptions) => { item.asynload(form, selectedOptions); } : () => {}}
                changeOnSelect={item.changeOnSelect}
              />)}
            </Form.Item>);
            break;
          case 'Radio':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                getFieldDecorator(item.field, {
                })(<Radio.Group>
                  {
                    item.options.map((ele, i) => <Radio key={i} value={ele.value}>{ele.name}</Radio>)
                  }
                </Radio.Group>)
              }
            </Form.Item>);
            break;
          case 'DatePicker':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                getFieldDecorator(item.field, {
                })(<DatePicker />)
              }
            </Form.Item>);
            break;
          default:
            break;
        }

        return item;
      });

      return formItemNode;
    };

    return (
      <Form className="formPage" onSubmit={(e) => { this.props.submitForm(namespace, form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">{pagetitle}</div>
            <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
              &emsp;
              <Form.Item>
                <Button onClick={() => { this.props.handleReset(namespace, form, this.props.submitForm); }}>重置</Button>
              </Form.Item>
            </div>
          </Header>
          <Content className="formPageContent" id="formScrollContent">{formitem()}</Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // 提交表单
    submitForm: (namespace, form, e) => {
      if (e) { e.preventDefault(); }
      // 更新请求条件
      dispatch({
        type: `${namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });
      // 发送请求
      dispatch({
        type: `${namespace}/insertRow`,
      });
    },
    // 重置表单
    handleReset: (namespace, form, submitForm) => {
      form.resetFields();
      submitForm(namespace, form);
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    console.log(props);
    const { req } = props.pagedata;
    const newmap = {};

    for (const key in req) {
      if (key) {
        newmap[key] = (req[key].value) ? req[key] : false;
      }
    }

    return newmap;
  },
})(FormPage));
