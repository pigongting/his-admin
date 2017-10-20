import React from 'react';
import update from 'immutability-helper';
import * as fetch from '../../services/app/doctor';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow } from '../../reducers/app/doctor';
import { fetchDeptTreeData, updateDeptTreeData } from '../../reducers/app/dept';
import { updateCascadAddr } from '../../reducers/cascadAddr';
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

initstate.req.sql = {
  createDt: 'between',
};

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
    updateCascadAddr,
    updateDeptTreeData,
    updateHospitalAllData,
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
    fetchDeptTreeData: (action, { call, put, select }) => fetchDeptTreeData(action, { call, put, select }, pagespace),
    fetchHospitalAllData: (action, { call, put, select }) => fetchHospitalAllData(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
