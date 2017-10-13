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
    // console.log(this);

    this.state = {
      tableSize: 'middle',
      setColumnModalVisible: false,
      clickedRows: [],
      selectedRows: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.setState(update(this.state, {
        selectedRows: {
          $set: [],
        },
        clickedRows: {
          $set: [],
        },
      }));
    }
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

  setClickedRow(record) {
    this.setState(update(this.state, {
      clickedRows: {
        $push: [record.key],
      },
    }));
  }

  setSelectedRows(selectedRowKeys) {
    this.setState(update(this.state, {
      selectedRows: {
        $set: selectedRowKeys,
      },
    }));
  }

  hideSetColumnModal() {
    this.setState(update(this.state, {
      setColumnModalVisible: {
        $set: false,
      },
    }));
  }

  render() {
    const { tableSize, setColumnModalVisible, clickedRows, selectedRows } = this.state;
    const { namespace, rows, columns, fullcolumns, showcolumns, current, pageSize, total, loading } = this.props;

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
            current={current}
            pageSize={pageSize}
            total={total}
            showTotal={(totalParams, range) => { return `${range[0]}-${range[1]} of ${totalParams} items`; }}
            onChange={(page, pageSizeParams) => this.props.pageChange(page, pageSizeParams, namespace)}
          />
          <Button className="tableReload" style={{ marginLeft: 8 }} onClick={() => this.props.reload(namespace)}><i className="tableReloadIcon" /></Button>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
          </Dropdown>
          <Modal title="配置表格列" wrapClassName="columnModal" visible={setColumnModalVisible} onCancel={() => this.hideSetColumnModal()} footer={null}>
            <Checkbox.Group value={showcolumns} onChange={checkedValue => this.props.setShowColumns(checkedValue, namespace)}>
              <Row>{fullcolumns.map((item, index) => <Col key={index} span={8}><Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox></Col>)}</Row>
            </Checkbox.Group>
          </Modal>
        </div>
        {
          (selectedRows.length > 0) ?
            <div className={cs('batchOperation', tableSize)}>
              <Button type="danger" onClick={() => this.props.batchDelete(selectedRows, namespace)} icon="delete" autoFocus>删除</Button>
            </div>
          : null
        }
        <Table
          rowSelection={{
            type: 'checkbox',
            selections: true,
            selectedRowKeys: selectedRows,
            onChange: selectedRowKeys => this.setSelectedRows(selectedRowKeys),
          }}
          pagination={false}
          size={tableSize}
          dataSource={rows}
          columns={columns}
          rowClassName={(record) => { return (clickedRows.includes(record.key)) ? 'clicked' : ''; }}
          onChange={(pagination, filters, sorter) => this.props.tableChange(pagination, filters, sorter, namespace)}
          loading={{ size: 'default', spinning: loading }}
          locale={{ filterTitle: '筛选', filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据' }}
          onRowClick={record => this.setClickedRow(record)}
        />
        <div className="tablePagination">
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
            defaultPageSize={20}
            current={current}
            pageSize={pageSize}
            total={total}
            showTotal={(totalParams, range) => { return `${range[0]}-${range[1]} of ${totalParams} items`; }}
            onChange={(page, pageSizeParams) => this.props.pageChange(page, pageSizeParams, namespace)}
            onShowSizeChange={(page, pageSizeParams) => this.props.pageChange(page, pageSizeParams, namespace)}
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
        type: `${namespace}/fetchTableData`,
      });
    },
    // 切换分页
    pageChange: (page, pageSize, namespace) => {
      dispatch({
        type: `${namespace}/fetchTableData`,
        payload: { index: page, size: pageSize },
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
    batchDelete: (selectedRows, namespace) => {
      dispatch({
        type: `${namespace}/batchDeleteRow`,
        payload: selectedRows,
      });
    },
    // 表格自带筛选，排序
    tableChange: (pagination, filters, sorter, namespace) => {
      // 更新筛选排序条件
      dispatch({
        type: `${namespace}/updateTableFillter`,
        payload: { filter: filters, orders: sorter },
      });
      // 发送请求
      dispatch({
        type: `${namespace}/fetchTableData`,
        payload: { index: 1 },
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FormTableAndPage);
