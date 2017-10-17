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
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      import(/* webpackChunkName: "cascadAddr" */ '../../data/cascadAddr')
      .then((data) => {
        console.log(data);
      })
      .catch(err => console.log('Failed to load moment', err));
    }
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
                  onFocus={(res[item.field]) ? () => {} : () => { item.asynload(form); }}
                  getPopupContainer={() => document.getElementById('formScrollContent')}
                >
                  {res[item.field] && res[item.field].map((ele, i) =>
                    <Select.Option key={i} value={ele[item.field]}>{ele[item.name]}</Select.Option>,
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
                onPopupVisibleChange={(res[item.field] === undefined) ? (selectedOptions) => { item.asynload(form, selectedOptions); } : () => {}}
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
  const d = moment(str, 'YYYY-MM-DD');
  if (d == null || !d.isValid()) return false;

  return str.indexOf(d.format('YYYY-M-D')) >= 0
      || str.indexOf(d.format('YYYY-MM-DD')) >= 0
      || str.indexOf(d.format('YY-M-D')) >= 0
      || str.indexOf(d.format('YY-MM-DD')) >= 0;
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    console.log(props);
    const { pagedata, momentkey } = props;
    const { req } = pagedata;
    const newmap = {};

    for (const key in req) {
      if (req[key].value) {
        newmap[key] = req[key];
        // if (momentkey.includes(key)) {
        //   newmap[key].value = (isValidDate(req[key].value)) ? moment(req[key].value) : false;
        // }
        if (isValidDate(req[key].value)) {
          newmap[key].value = moment(req[key].value);
        } else {
          newmap[key].value = false;
        }
      } else {
        newmap[key] = false;
      }
    }

    return newmap;
  },
})(FormPage));
