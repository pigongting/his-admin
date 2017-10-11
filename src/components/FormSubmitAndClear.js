import React from 'react';
// antd 组件
import { Button, Form } from 'antd';

class FormSubmitAndClear extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleReset, submitForm, form } = this.props;

    return (
      <div className="fillterOperate">
        <Form.Item>
          <Button type="primary" htmlType="submit" size="default">开始筛选</Button>
        </Form.Item>
        &emsp;
        <Form.Item>
          <Button size="default" onClick={() => { handleReset(form, submitForm); }}>清空</Button>
        </Form.Item>
      </div>
    );
  }
}

export default FormSubmitAndClear;
