import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchDeptTreeData, updateDeptTreeData } from '../../reducers/app/dept';
import { fetchHospitalAllData, updateHospitalAllData } from '../../reducers/app/hospital';
import { updateCascadAddr } from '../../reducers/cascadAddr';
import { fetchViewedRow, fetchInsertRow, fetchUpdateRow } from '../../reducers/app/doctor';

const pagespace = 'appdoctoredit';
const pagepath = '/app/doctoredit';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateCascadAddr,
    updateDeptTreeData,
    updateHospitalAllData,
  },

  effects: {
    fetchViewedRow: (action, { call, put, select }) => fetchViewedRow(action, { call, put, select }, pagespace),
    fetchInsertRow: (action, { call, put, select }) => fetchInsertRow(action, { call, put, select }, pagespace),
    fetchUpdateRow: (action, { call, put, select }) => fetchUpdateRow(action, { call, put, select }, pagespace),
    fetchDeptTreeData: (action, { call, put, select }) => fetchDeptTreeData(action, { call, put, select }, pagespace),
    fetchHospitalAllData: (action, { call, put, select }) => fetchHospitalAllData(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
