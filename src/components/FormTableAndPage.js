import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import cs from 'classnames';
// antd 组件
import { notification, Layout, Form, Button, DatePicker, Dropdown, Table, Pagination, Input, Select, Menu, Icon, Modal, Checkbox, Row, Col } from 'antd';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const ItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class FormTableAndPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { req, res, set } = this.props.pageprops.pagedata;

    return (
      <div>
        {
          (set.tableSelected.length > 0) ?
            <div className={cs('batchOperation', set.tableSize)}>
              <Button type="danger" onClick={this.props.pageprops.batchDelete} icon="delete" autoFocus>删除</Button>
            </div>
          : null
        }
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: set.tableSelected,
            onChange: this.props.pageprops.rowSelectionHandler,
            selections: true,
          }}
          pagination={false}
          size={set.tableSize}
          dataSource={res.rows}
          columns={this.props.pagecolumns}
          rowClassName={(record, index) => { return (set.rowClicked.includes(record.key)) ? 'clicked' : ''; }}
          onChange={this.props.pageprops.tableChange}
          loading={{
            size: 'default',
            spinning: this.props.pageprops.loading,
            tip: 'loading',
            wrapperClassName: 'aaaa',
          }}
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          }}
          onRowClick={this.props.pageprops.rowClick}
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
            onChange={this.props.pageprops.pageChange}
            onShowSizeChange={this.props.pageprops.pageChange}
          />
        </div>
      </div>
    );
  }
}

export default FormTableAndPage;
