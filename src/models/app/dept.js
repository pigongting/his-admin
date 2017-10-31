import React from 'react';
import update from 'immutability-helper';
import * as fetch from '../../services/app/doctor';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow } from '../../reducers/app/dept';

const pagespace = 'appdept';
const pagepath = '/app/dept';
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
