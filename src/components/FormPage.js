import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
// antd 组件
import { Form, Layout, Button, Input, Select, Cascader, Radio, DatePicker } from 'antd';
// 表单配置
import { formItemLayout, tailFormItemLayout } from '../../config/formConfig';
// antd 组件扩展
const { Header, Content } = Layout;
const { TextArea } = Input;

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.pagedata.form = this.props.form;
  }

  componentDidMount() {
    const { itemdata } = this.props;

    itemdata.map((item, index) => {
      if (item.asynload) {
        item.asynload(true);
      }
      return item;
    });
  }

  render() {
    const { form, namespace, pagedata, pagetitle, itemdata } = this.props;
    const { res, set } = pagedata;
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
                  onFocus={(res[item.field]) ? () => {} : item.asynload}
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
                loadData={item.asynload}
                onPopupVisibleChange={(res[item.field] === undefined) ? item.asynload : () => {}}
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
      <Form className="formPage" onSubmit={(e) => { this.props.handleSubmit(form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">{pagetitle[set.mode]}</div>
            <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
              &emsp;
              <Form.Item>
                <Button onClick={() => { this.props.handleReset(form, this.props.handleSubmit); }}>重置</Button>
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
  const { namespace } = ownProps;
  return {
    handleSubmit: (form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          // 更新表单参数
          dispatch({
            type: `${namespace}/updateFormReq`,
            payload: form.getFieldsValue(),
          });
          // 提交表单
          // dispatch({
          //   type: `${namespace}/fetchInsertRow`,
          // });
        }
      });
    },
    handleReset: (form, handleSubmit) => {
      form.resetFields();
      handleSubmit(namespace, form);
    },
  };
}

function mapStateToProps(state, ownProps) {
  const { namespace } = ownProps;
  return {
    pagedata: state[namespace],
    loading: state.loading.effects[`${namespace}/fetchTableData`],
    locale: state.ssr.locale,
  };
}

function isValidDate(str) {
  if (typeof str !== 'string') return false;

  const d = moment(str, 'YYYY-MM-DD');
  if (d == null || !d.isValid()) return false;

  return str.indexOf(d.format('YYYY-M-D')) >= 0
      || str.indexOf(d.format('YYYY-MM-DD')) >= 0
      || str.indexOf(d.format('YY-M-D')) >= 0
      || str.indexOf(d.format('YY-MM-DD')) >= 0;
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata, momentkey } = props;
    const { req, form } = pagedata;
    // console.log(req);
    // console.log(form);
    const formdata = form && form.getFieldsValue();
    const newmap = {};

    for (const key in req) {
      if (Object.prototype.hasOwnProperty.call(req, key)) {
        const reqkeyvalue = req[key].value;
        const formkeyvalue = formdata && formdata[key];

        if (reqkeyvalue !== undefined) {
          newmap[key] = req[key];
          if (isValidDate(reqkeyvalue) && !moment.isMoment(reqkeyvalue)) {
            newmap[key].value = (isValidDate(reqkeyvalue)) ? moment(reqkeyvalue) : undefined;
          }
        } else if (formkeyvalue !== undefined) {
          newmap[key] = { value: formkeyvalue };
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(FormPage));
