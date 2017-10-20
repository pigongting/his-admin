import React from 'react';
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
    const { req, res, set } = pagedata;
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
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
                : getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                    { pattern: item.pattern || false, message: item.patternmsg },
                  ],
                })(<Input disabled={item.disabled} />)
              }
            </Form.Item>);
            break;
          case 'TextArea':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
                : getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                    { pattern: item.pattern || false, message: item.patternmsg },
                  ],
                })(<TextArea disabled={item.disabled || set.mode === 'view'} autosize={{ minRows: 2, maxRows: 6 }} />)
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
                  disabled={item.disabled || set.mode === 'view'}
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
                disabled={item.disabled || set.mode === 'view'}
              />)}
            </Form.Item>);
            break;
          case 'Radio':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{
                  item.options.map((ele, i) => { if (ele.value === req.fields[item.field] && req.fields[item.field].value) { return ele.name; } else { return null; } })
                }</div>
                : getFieldDecorator(item.field, {})(<Radio.Group disabled={item.disabled}>{
                  item.options.map((ele, i) => <Radio key={i} value={ele.value}>{ele.name}</Radio>)
                }</Radio.Group>)
              }
            </Form.Item>);
            break;
          case 'DatePicker':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value && req.fields[item.field] && req.fields[item.field].value.format('YYYY-MM-DD')}</div>
                : getFieldDecorator(item.field, {})(<DatePicker disabled={item.disabled} />)
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
      <Form className="formPage" id={`${set.mode}Mode`} onSubmit={(e) => { this.props.handleSubmit(set.mode, form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">{pagetitle[set.mode]}</div>
            {(set.mode !== 'view') ? <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
              &emsp;
              <Form.Item>
                <Button onClick={() => { this.props.handleReset(form); }}>重置</Button>
              </Form.Item>
            </div> : null}
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
    handleSubmit: (mode, form, e) => {
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
          if (mode === 'adds') {
            // 插入
            dispatch({
              type: `${namespace}/fetchInsertRow`,
            });
          } else if (mode === 'edit') {
            // 更新
            dispatch({
              type: `${namespace}/fetchUpdateRow`,
            });
          }
        }
      });
    },
    handleReset: (form) => {
      form.resetFields();
    },
  };
}

function mapStateToProps(state, ownProps) {
  const { namespace } = ownProps;
  return {
    pagedata: state[namespace],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata } = props;
    const { req, form } = pagedata;
    const { fields } = req;
    // console.log(fields);
    // console.log(form);
    const formdata = form && form.getFieldsValue();
    const newmap = {};

    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        const fieldskeyvalue = fields[key].value;
        const formkeyvalue = formdata && formdata[key];

        if (fieldskeyvalue !== undefined) {
          newmap[key] = fields[key];
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
