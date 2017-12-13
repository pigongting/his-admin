import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow, fetchDeptTreeData, updateDeptTreeData } from '../../reducers/app/dept';

const pagespace = 'appdept';
const pagepath = '/app/dept';
const columns = [
  '医院科室ID',
  '科室名称',
  '简介',
  '医院ID',
  '父科室ID',
  '科室楼',
  '科室地址',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.sql = {
  createDt: 'between',
};

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
    updateDeptTreeData,
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
    fetchDeptTreeData: (action, { call, put, select }) => fetchDeptTreeData(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
