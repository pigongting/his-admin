import React from 'react';
import update from 'immutability-helper';
import cs from 'classnames';
import { connect } from 'dva';
// antd 组件
import { Form, Table, Layout, Button, Input, Select, Cascader, Radio, DatePicker, Pagination, Dropdown, Modal, Checkbox, Row, Col, Menu, Icon } from 'antd';
// antd 组件扩展
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

// 获取当前列
const getNowColumns = (columns, showColumns, req) => {
  const nowColumns = [];
  columns.map((item, index) => {
    if (showColumns.includes(item.title) || item.key === 'operation') {
      const newitem = item;
      if (newitem.sorter) { newitem.sortOrder = req.orders[newitem.dataIndex] ? req.orders[newitem.dataIndex][1] : false; }
      nowColumns.push(newitem);
    }
    return item;
  });
  return nowColumns;
};

class FormTablePage extends React.Component {
  constructor(props) {
    super(props);
    const { pagedata, form, columns } = this.props;
    const { showColumns } = pagedata.set;

    pagedata.form = form;

    this.state = {
      nowColumns: getNowColumns(columns, showColumns, pagedata.req),
      tableSize: 'middle',
      setColumnModalVisible: false,
      selectedRows: [],
      clickedRows: [],
    };
  }

  componentDidMount() {
    const { formItems } = this.props;

    formItems.map((item, index) => {
      if (item.asynload) {
        item.asynload(true);
      }
      return item;
    });
  }

  componentWillReceiveProps(nextProps) {
    const { req: nextreq, res: nextres, set: nextset } = nextProps.pagedata;
    const { req, res, set } = this.props.pagedata;
    const { columns } = this.props;

    // 外部数据变化时，显示列数据变化时，重新渲染表单
    if (nextset.showColumns !== set.showColumns || nextreq.orders !== req.orders) {
      this.setState(update(this.state, { nowColumns: { $set: getNowColumns(columns, nextset.showColumns, nextreq) } }));
    }

    // 外部数据变化时，行数据变化时，清除选中行和点击行
    if (nextres.rows !== res.rows) {
      this.setState(update(this.state, { selectedRows: { $set: [] }, clickedRows: { $set: [] } }));
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

  /* 生成表格设置菜单 */
  generateTabelSetMenu() {
    const { tableSize } = this.state;
    return (
      <Menu onClick={params => this.setTable(params)}>
        <Menu.ItemGroup title="显示密度">
          <Menu.Item key="0" className={(tableSize === 'default') ? 'checkmark' : ''}>标准</Menu.Item>
          <Menu.Item key="1" className={(tableSize === 'middle') ? 'checkmark' : ''}>适中</Menu.Item>
          <Menu.Item key="2" className={(tableSize === 'small') ? 'checkmark' : ''}>紧凑</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );
  }

  /* 生成表单项 */
  generateFormItem() {
    const { form, pagedata, formItems } = this.props;
    const { res } = pagedata;
    const { getFieldDecorator } = form;

    return formItems.map((item, index) => {
      switch (item.type) {
        case 'Select':
          return (<Form.Item key={index} label={item.label}>
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
                disabled={item.disabled}
                style={{ width: item.width }}
                size="default"
              >
                {res[item.field] && res[item.field].map((ele, i) =>
                  <Select.Option key={i} value={`${ele[item.field]}`}>{ele[item.name]}</Select.Option>,
                )}
              </Select>)
            }
          </Form.Item>);
        case 'Cascader':
          return (<Form.Item key={index} label={item.label}>
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
              disabled={item.disabled}
              style={{ width: item.width }}
              size="default"
            />)}
          </Form.Item>);
        default:
          return null;
      }
    });
  }

  render() {
    const { nowColumns, tableSize, setColumnModalVisible, clickedRows, selectedRows } = this.state;
    const { form, pagedata, loading, searchOptions, searchPlaceholder, headerOperates } = this.props;
    const { req, res, set } = pagedata;
    const { page } = req;
    const { rows } = res;
    const { fullColumns, showColumns } = set;
    const { getFieldDecorator } = form;

    return (
      <Form className="formTablePage" onSubmit={(e) => { this.props.handleSubmit(form, e); }}>
        <Layout className="tablePage">
          <Header className="tableHeader">
            <div className="search">
              <Form.Item>
                {getFieldDecorator('searchkey', {
                  initialValue: searchOptions[0].value,
                })(<Select size="default">
                  { searchOptions.map((item, index) => <Select.Option key={index} value={item.value}>{item.title}</Select.Option>) }
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('searchvalue', {
                })(<Input size="default" placeholder={searchPlaceholder} onPressEnter={(e) => { this.props.handleSubmit(form); }} />)}
              </Form.Item>
            </div>
            <div className="operate">{headerOperates}</div>
            <div className="pagination">
              <Pagination
                defaultCurrent={1}
                defaultPageSize={20}
                current={page.index}
                pageSize={page.size}
                total={page.total}
                onChange={this.props.pageChange}
                showTotal={(total, range) => { return `${range[0]}-${range[1]} of ${total} items`; }}
              />
              <Button className="tableReload" style={{ marginLeft: 8 }} onClick={this.props.reload}>
                <i className="tableReloadIcon" />
              </Button>
              <Dropdown overlay={(() => this.generateTabelSetMenu())()} trigger={['click']} placement="bottomRight">
                <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
              </Dropdown>
              <Modal
                title="配置表格列"
                wrapClassName="columnModal"
                footer={null}
                visible={setColumnModalVisible}
                onCancel={params => this.hideSetColumnModal(params)}
              >
                <Checkbox.Group value={showColumns} onChange={this.props.setShowColumns}>
                  <Row>
                    {fullColumns.map((item, index) => <Col key={index} span={8}>
                      <Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox>
                    </Col>)}
                  </Row>
                </Checkbox.Group>
              </Modal>
            </div>
          </Header>
          <Content className="tableContent" id="formScrollContent">
            <div className="tableFillter">
              <div className="fillterTitle">筛选项</div>
              {(() => this.generateFormItem())()}
              <div className="fillterOperate">
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="default">开始筛选</Button>
                </Form.Item>
                &emsp;
                <Form.Item>
                  <Button size="default" onClick={() => { this.props.handleReset(form, this.props.handleSubmit); }}>清空</Button>
                </Form.Item>
              </div>
            </div>
            {
              (selectedRows.length > 0) ?
                <div className={cs('batchOperation', tableSize)}>
                  <Button type="danger" onClick={this.props.batchDelete} icon="delete" autoFocus>删除</Button>
                </div>
              : null
            }
            <Table
              rowSelection={{
                type: 'checkbox',
                selections: true,
                selectedRowKeys: selectedRows,
                onChange: params => this.setSelectedRows(params),
              }}
              pagination={false}
              size={tableSize}
              dataSource={rows}
              columns={nowColumns}
              rowClassName={(record) => { return (clickedRows.includes(record.key)) ? 'clicked' : ''; }}
              loading={{ size: 'default', spinning: loading }}
              locale={{ filterTitle: '筛选', filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据' }}
              onChange={this.props.tableChange}
              onRowClick={params => this.setClickedRow(params)}
            />
            <div className="tablePagination">
              <Pagination
                showSizeChanger
                showQuickJumper
                defaultCurrent={1}
                defaultPageSize={20}
                current={page.index}
                pageSize={page.size}
                total={page.total}
                onChange={this.props.pageChange}
                onShowSizeChange={this.props.pageChange}
                showTotal={(totalParams, range) => { return `${range[0]}-${range[1]} of ${totalParams} items`; }}
              />
            </div>
          </Content>
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
            type: `${namespace}/updateFormFillter`,
            payload: form.getFieldsValue(),
          });
        }
      });
    },
    handleReset: (form) => {
      form.resetFields();
    },
    // 重载当前页
    reload: () => {
      dispatch({ type: `${namespace}/fetchTableData` });
    },
    // 切换分页
    pageChange: (page, pageSize) => {
      dispatch({
        type: `${namespace}/fetchTableData`,
        payload: { index: page, size: pageSize },
      });
    },
    // 设置显示的表格列
    setShowColumns: (checkedValue) => {
      dispatch({
        type: `${namespace}/setTableColumns`,
        payload: checkedValue,
      });
    },
    // 删除当前选中的行
    batchDelete: (selectedRows) => {
      dispatch({
        type: `${namespace}/batchDeleteRow`,
        payload: selectedRows,
      });
    },
    // 表格自带筛选，排序
    tableChange: (pagination, filters, sorter) => {
      // 更新筛选排序条件
      dispatch({
        type: `${namespace}/updateTableFillter`,
        tableFilters: filters,
        tableSorter: sorter,
      });
      // 发送请求
      // dispatch({
      //   type: `${namespace}/fetchTableData`,
      //   payload: { index: 1 },
      // });
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata } = props;
    const { req, form } = pagedata;
    const { formFilters } = req;
    // console.log(formFilters);
    // console.log(form);
    const formNoMapData = form && form.getFieldsValue();
    const newmap = {};

    for (const key in formFilters) {
      if (Object.prototype.hasOwnProperty.call(formFilters, key)) {
        const formFiltersKeyValue = formFilters[key].value;
        const formNoMapKey = formNoMapData && formNoMapData[key];

        if (formFiltersKeyValue !== undefined) {
          newmap[key] = formFilters[key];
        } else if (formNoMapKey !== undefined) {
          newmap[key] = { value: formNoMapKey };
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(FormTablePage));
