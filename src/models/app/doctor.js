import React from 'react';
import update from 'immutability-helper';
import * as fetch from '../../services/app/doctor';
import { removelocal } from '../../utils/localpath';
import { getinitstate, resetstate, resetTable, updateTable, updatePages, setTableColumns, updateTableFillter, updateFormFillter, fetchTableData, batchDeleteRow } from '../../reducers/commonFormTable';
import { fetchDeptTreeData, updateDeptTreeData } from '../../reducers/app/dept';
import { fetchHospitalAllData, updateHospitalAllData } from '../../reducers/app/hospital';

const pagespace = 'appdoctor';
const pagepath = '/app/doctor';
const columns = [
  '医生名称',
  '医生头衔',
  '手机号码',
  '是否会诊',
  '是否专家',
  '特长',
  '职称',
  '状态',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.formFilters = {
  hospitalId: {
    value: '1',
  },
  searchkey: {
    value: 'mobile',
  },
  searchvalue: {
    value: '皮',
  },
};

initstate.req.sql = {
  hospitalId: '=',
};

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    resetTable,
    updateTable,
    updatePages,
    setTableColumns,
    updateTableFillter,
    updateFormFillter,
    updateDeptTreeData,
    updateHospitalAllData,
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace, fetch.listPageData),
    batchDeleteRow: (action, { call, put, select }) => batchDeleteRow(action, { call, put, select }, pagespace, fetch.deleteRow),
    fetchDeptTreeData: (action, { call, put, select }) => fetchDeptTreeData(action, { call, put, select }, pagespace),
    fetchHospitalAllData: (action, { call, put, select }) => fetchHospitalAllData(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === pagepath) {
          dispatch({ type: 'fetchTableData', payload: { index: 1, size: 2 } });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
