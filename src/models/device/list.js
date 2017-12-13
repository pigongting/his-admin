import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow } from '../../reducers/device/machine';

const pagespace = 'devicemachine';
const pagepath = '/device/machine';
const columns = [
  '设备编号',
  '型号',
  '型号名称',
  '安装位置',
  '铺设负责人',
  '维护负责人',
  '状态',
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
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
