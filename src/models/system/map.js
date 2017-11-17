import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow } from '../../reducers/system/map';

const pagespace = 'systemmap';
const pagepath = '/system/map';
const columns = [
  '楼宇',
  '楼层',
  '科室',
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
