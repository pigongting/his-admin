import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchViewedRow, fetchInsertRow, fetchUpdateRow } from '../../reducers/system/map';

const pagespace = 'systemmapdetail';
const pagepath = '/system/mapdetail';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
  },

  effects: {
    fetchViewedRow: (action, { call, put, select }) => fetchViewedRow(action, { call, put, select }, pagespace),
    fetchInsertRow: (action, { call, put, select }) => fetchInsertRow(action, { call, put, select }, pagespace),
    fetchUpdateRow: (action, { call, put, select }) => fetchUpdateRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
