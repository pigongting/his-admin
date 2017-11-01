import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchHospitalAllData, updateHospitalAllData } from '../../reducers/app/hospital';
import { fetchDeptTreeData, updateDeptTreeData, fetchViewedRow, fetchInsertRow, fetchUpdateRow } from '../../reducers/app/dept';

const pagespace = 'appdeptdetail';
const pagepath = '/app/deptdetail';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
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
