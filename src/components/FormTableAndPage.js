import React from 'react';
import update from 'immutability-helper';
import cs from 'classnames';
import { connect } from 'dva';
// antd 组件
import { Button, Dropdown, Table, Pagination, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';
// antd 组件扩展
const ItemGroup = Menu.ItemGroup;

class FormTableAndPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);

    this.state = {
      tableSize: 'middle',
      setColumnModalVisible: false,
    };
  }

  setTable({ item, key, keyPath }) {
    switch (key) {
      case '0':
        this.setState(update(this.state, {
          tableSize: {
            $set: 'default',
          },
        }));
        break;
      case '1':
        this.setState(update(this.state, {
          tableSize: {
            $set: 'middle',
          },
        }));
        break;
      case '2':
        this.setState(update(this.state, {
          tableSize: {
            $set: 'small',
          },
        }));
        break;
      case '3':
        this.setState(update(this.state, {
          setColumnModalVisible: {
            $set: !this.state.setColumnModalVisible,
          },
        }));
        break;
      default:
        break;
    }
  }

  hideSetColumnModal() {
    this.setState(update(this.state, {
      setColumnModalVisible: {
        $set: false,
      },
    }));
  }

  render() {
    const { tableSize, setColumnModalVisible } = this.state;
    const { namespace } = this.props;
    const { req, res, set } = this.props.pageprops.pagedata;
    const { loading, pagecolumns } = this.props.pageprops;

    // 表格设置下拉列表
    const menu = (
      <Menu onClick={item => this.setTable(item)}>
        <ItemGroup title="显示密度">
          <Menu.Item key="0" className={(tableSize === 'default') ? 'checkmark' : ''}>标准</Menu.Item>
          <Menu.Item key="1" className={(tableSize === 'middle') ? 'checkmark' : ''}>适中</Menu.Item>
          <Menu.Item key="2" className={(tableSize === 'small') ? 'checkmark' : ''}>紧凑</Menu.Item>
        </ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );

    return (
      <div>
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
            onChange={(page, pageSize) => this.props.pageChange(page, pageSize, namespace)}
          />
          <Button className="tableReload" style={{ marginLeft: 8 }} onClick={() => this.props.reload(namespace)}><i className="tableReloadIcon" /></Button>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
          </Dropdown>
          <Modal title="配置表格列" wrapClassName="columnModal" visible={setColumnModalVisible} onCancel={() => this.hideSetColumnModal()} footer={null}>
            <Checkbox.Group value={set.tableColumns} onChange={checkedValue => this.props.setShowColumns(checkedValue, namespace)}>
              <Row>{set.fullColumns.map((item, index) => <Col key={index} span={8}><Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox></Col>)}</Row>
            </Checkbox.Group>
          </Modal>
        </div>
        {
          (set.tableSelected.length > 0) ?
            <div className={cs('batchOperation', tableSize)}>
              <Button type="danger" onClick={() => this.props.batchDelete(namespace)} icon="delete" autoFocus>删除</Button>
            </div>
          : null
        }
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: set.tableSelected,
            onChange: (selectedRowKeys, selectedRows) => this.props.rowSelectionHandler(selectedRowKeys, selectedRows, namespace),
            selections: true,
          }}
          pagination={false}
          size={tableSize}
          dataSource={res.rows}
          columns={pagecolumns}
          rowClassName={(record, index) => { return (set.rowClicked.includes(record.key)) ? 'clicked' : ''; }}
          onChange={(pagination, filters, sorter) => this.props.tableChange(pagination, filters, sorter, namespace)}
          loading={{
            size: 'default',
            spinning: loading,
          }}
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          }}
          onRowClick={(record, index, event) => this.props.rowClick(record, index, event, namespace)}
        />
        <div className="tablePagination">
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
            defaultPageSize={20}
            current={req.page.index}
            pageSize={req.page.size}
            total={req.page.total}
            showTotal={(total, range) => {
              return `${range[0]}-${range[1]} of ${total} items`;
            }}
            onChange={(page, pageSize) => this.props.pageChange(page, pageSize, namespace)}
            onShowSizeChange={(page, pageSize) => this.props.pageChange(page, pageSize, namespace)}
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // 重载当前页
    reload: (namespace) => {
      dispatch({
        type: `${namespace}/fetch`,
      });
    },
    // 设置显示的表格列
    setShowColumns: (checkedValue, namespace) => {
      dispatch({
        type: `${namespace}/setTableColumns`,
        payload: checkedValue,
      });
    },
    // 删除当前选中的行
    batchDelete: (namespace) => {
      dispatch({
        type: `${namespace}/batchDelete`,
      });
    },
    // 切换分页
    pageChange: (page, pageSize, namespace) => {
      dispatch({
        type: `${namespace}/fetch`,
        payload: { index: page, size: pageSize },
      });
    },
    // 当前选中的行
    rowSelectionHandler: (selectedRowKeys, selectedRows, namespace) => {
      dispatch({
        type: `${namespace}/rowSelected`,
        payload: selectedRowKeys,
      });
    },
    // 表格自带筛选，排序
    tableChange: (pagination, filters, sorter, namespace) => {
      console.log(filters, sorter);
      dispatch({
        type: `${namespace}/tableChange`,
        payload: {
          filter: filters,
          orders: sorter,
        },
      });
      dispatch({
        type: `${namespace}/fetch`,
        payload: {
          index: 1,
        },
      });
    },
    // 点击表格行
    rowClick: (record, index, event, namespace) => {
      dispatch({
        type: `${namespace}/recordRowClick`,
        payload: record.key,
      });
    },
  };
}

export default connect(mapDispatchToProps)(FormTableAndPage);
