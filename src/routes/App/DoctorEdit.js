import React from 'react';
import update from 'immutability-helper';
import moment from 'moment';
import { connect } from 'dva';
// antd 组件
import { Layout, Form, DatePicker, Dropdown, Input, Select, Menu, Cascader, Button, Radio } from 'antd';
// 表单配置
import { formItemLayout, tailFormItemLayout } from '../../../config/formConfig';
// 级联地址
import { cascadAddr } from '../../../data/cascadAddr';
// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 页内配置
const pageConfig = {
  namespace: 'appdoctoredit',
};

class AppDoctorEdit extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);
  }

  render() {
    const { pagedata, loading, locale, form } = this.props;
    const { req, res, set } = pagedata;
    const { getFieldDecorator } = form;

    return (
      <Form className="formPage" onSubmit={(e) => { this.props.submitForm(form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">新增医生</div>
            <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
              &emsp;
              <Form.Item>
                <Button onClick={() => { this.props.handleReset(form, this.props.submitForm); }}>重置</Button>
              </Form.Item>
            </div>
          </Header>
          <Content className="formPageContent">
            <div className="formGroup">基本信息</div>
            <Form.Item {...formItemLayout} label="医生名称" hasFeedback>
              {getFieldDecorator('doctorName', {
                rules: [{ required: true, message: '请输入医生名称' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="医院">
              {getFieldDecorator('hospitalId', {
                rules: [{ required: true, message: '请选择医院' }],
              })(<Select
                placeholder="请选择"
                notFoundContent="加载中..."
                onFocus={(res.hospital) ? () => {} : () => { this.props.loadHospitalData(form); }}
              >
                {res.hospital && res.hospital.map((item, index) => <Select.Option key={index} value={`${item.hospitalId}`}>{item.hospitalName}</Select.Option>)}
              </Select>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="科室">
              {getFieldDecorator('hospitalDeptId', {
                rules: [{ required: true, message: '请选择科室' }],
              })(<Cascader
                placeholder="请选择"
                options={res.dept}
                loadData={selectedOptions => this.props.loadDeptData(form, selectedOptions)}
                onPopupVisibleChange={(res.dept[0].value === '') ? (selectedOptions) => { this.props.loadDeptData(form, selectedOptions); } : () => {}}
                changeOnSelect
              />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="性别">
              {getFieldDecorator('gender', {
              })(
                <Radio.Group>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="出生日期">
              {getFieldDecorator('birthday', {
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="身高" hasFeedback>
              {getFieldDecorator('height', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="体重" hasFeedback>
              {getFieldDecorator('weight', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="地区">
              {getFieldDecorator('pcaCode', {})(<Cascader options={cascadAddr} expandTrigger="hover" placeholder="请选择" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', {})(<TextArea autosize />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮政编码">
              {getFieldDecorator('postCode', {
                rules: [{
                  pattern: /[1-9]\d{5}(?!\d)/, message: '请输入正确的邮政编码!',
                }],
              })(<Input maxLength="6" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="手机号码">
              {getFieldDecorator('mobile', {
                rules: [{
                  pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确的手机号码!',
                }],
              })(<Input maxLength="11" />)}
            </Form.Item>
            <div className="formGroup">资历信息</div>
            <Form.Item {...formItemLayout} label="医生头衔" hasFeedback>
              {getFieldDecorator('doctorCap', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="简介">
              {getFieldDecorator('intro', {})(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="特长">
              {getFieldDecorator('specialty', {})(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学历" hasFeedback>
              {getFieldDecorator('education', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="职称" hasFeedback>
              {getFieldDecorator('title', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="社会机构及职务" hasFeedback>
              {getFieldDecorator('duties', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="机构编码" hasFeedback>
              {getFieldDecorator('orgCode', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证件类型" hasFeedback>
              {getFieldDecorator('idType', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证件号码" hasFeedback>
              {getFieldDecorator('idNumber', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证书编号" hasFeedback>
              {getFieldDecorator('certificateNo', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证件图片" hasFeedback>
              {getFieldDecorator('idUrl', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="签名图片" hasFeedback>
              {getFieldDecorator('signatureUrl', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="医师执业证书图片" hasFeedback>
              {getFieldDecorator('certificateUrl', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="医生图像图片" hasFeedback>
              {getFieldDecorator('imageUrl', {})(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {})(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </Form.Item>
            <div className="formGroup">开关信息</div>
            <Form.Item {...formItemLayout} label="认证状态">
              {getFieldDecorator('idState', {
              })(
                <Radio.Group>
                  <Radio value="1">已认证</Radio>
                  <Radio value="0">未认证</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否会诊">
              {getFieldDecorator('isConsultation', {
              })(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否专家">
              {getFieldDecorator('isExpert', {
              })(
                <Radio.Group>
                  <Radio value="true">是</Radio>
                  <Radio value="false">否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否激活">
              {getFieldDecorator('status', {
              })(
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // 表单筛选
    // 提交筛选表单
    submitForm: (form, e) => {
      if (e) { e.preventDefault(); }
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });
      // 发送请求
      dispatch({
        type: `${pageConfig.namespace}/insertRow`,
      });
    },
    // 清除所有筛选条件后提交筛选表单
    handleReset: (form, submitForm) => {
      form.resetFields();
      submitForm(form);
    },
    loadDeptData: (form, selectedOptions) => {
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });

      if (selectedOptions === true) {
        dispatch({ type: `${pageConfig.namespace}/fetchDeptFillter` });
      } else if (selectedOptions) {
        dispatch({ type: `${pageConfig.namespace}/fetchDeptFillter`, payload: selectedOptions[selectedOptions.length - 1] });
      }
    },
    loadHospitalData: (form) => {
      // 更新请求条件
      dispatch({
        type: `${pageConfig.namespace}/updateFormReq`,
        payload: form.getFieldsValue(),
      });

      dispatch({ type: `${pageConfig.namespace}/fetchHospitalFillter` });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pageConfig.namespace],
    loading: state.loading.effects[`${pageConfig.namespace}/fetchTableData`],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { req, res } = props.pagedata;
    const newmap = {};

    for (const key in req) {
      if (key) {
        newmap[key] = (req[key].value) ? req[key] : false;
      }
    }

    return newmap;
  },
})(AppDoctorEdit));
