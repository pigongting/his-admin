import React from 'react';
// antd 组件
import { Button, Dropdown, Pagination, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';
// antd 组件扩展
const ItemGroup = Menu.ItemGroup;

class FormTableHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { req, res, set } = this.props.pageprops.pagedata;

    // 表格设置下拉列表
    const menu = (
      <Menu onClick={this.props.pageprops.setMenu}>
        <ItemGroup title="显示密度">
          <Menu.Item key="0" className={(set.tableSize === 'default') ? 'checkmark' : ''}>标准</Menu.Item>
          <Menu.Item key="1" className={(set.tableSize === 'middle') ? 'checkmark' : ''}>适中</Menu.Item>
          <Menu.Item key="2" className={(set.tableSize === 'small') ? 'checkmark' : ''}>紧凑</Menu.Item>
        </ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );

    return (
      <div className="pagination">
        <Pagination
          defaultCurrent={1}
          defaultPageSize={20}
          current={req.page.index}
          pageSize={req.page.size}
          total={req.page.total}
          showTotal={(total, range) => {
            return `${range[0]}-${range[1]} of ${total} items`;
          }}
          onChange={this.props.pageprops.pageChange}
        />
        <Button className="tableReload" style={{ marginLeft: 8 }} onClick={this.props.pageprops.reload}><i className="tableReloadIcon" /></Button>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
        </Dropdown>
        <Modal
          title="配置表格列"
          visible={set.columnModal.visible}
          onCancel={this.props.pageprops.columnModalHide}
          footer={null}
          wrapClassName="columnModal"
        >
          <Checkbox.Group value={set.tableColumns} onChange={this.props.pageprops.setTableColumns}>
            <Row>
              {set.fullColumns.map((item, index) => {
                return (
                  <Col key={index} span={8}><Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox></Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </Modal>
      </div>
    );
  }
}

export default FormTableHeader;
