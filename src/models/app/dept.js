import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as fetch from '../../services/app/dept';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';
// 统一的纯函数
import { getinitstate, resetstate, resetTable, updateTable, updatePages, setTableColumns, updateTableFillter, updateFormFillter, fetchTableData, batchDeleteRow } from '../../reducers/commonFormTable';

// 页内配置
const pageConfig = {
  namespace: 'appdept',
  pagepath: '/app/dept',
  columntags: ['医院科室ID', '科室名称', '科室简介', '医院ID', '父科室 ', '楼层', '科室地址'],
};

// 初始状态
const initstate = getinitstate({
  columntags: pageConfig.columntags,
  searchkey: 'deptName',
});

export default {

  namespace: pageConfig.namespace,

  state: initstate,

  reducers: { resetstate: state => resetstate(state, initstate), resetTable, updateTable, updatePages, setTableColumns, updateTableFillter, updateFormFillter },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pageConfig.namespace, fetch.tableData),
    batchDeleteRow: (action, { call, put, select }) => batchDeleteRow(action, { call, put, select }, pageConfig.namespace, fetch.deleteRow),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === pageConfig.pagepath) {
          dispatch({ type: 'fetchTableData', payload: { index: 1, size: 20 } });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
