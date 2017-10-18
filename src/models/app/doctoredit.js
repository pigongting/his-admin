import { setup, getinitstate, resetstate, updateSetMode, updateFormReq, updateCascadAddr } from '../../reducers/commonForm';
import { fetchDeptTreeData, updateDeptTreeData } from '../../reducers/app/dept';
import { fetchHospitalAllData, updateHospitalAllData } from '../../reducers/app/hospital';
import { fetchViewedRow, fetchInsertRow, fetchUpdateRow } from '../../reducers/app/doctor';

const pagespace = 'appdoctoredit';
const pagepath = '/app/doctoredit';
const fields = [
  'doctorId',
  'hospitalId',
  'hospitalDeptId',
  'doctorName',
  'gender',
  'marriage',
  'birthday',
  'doctorCap',
  'pcaCode',
  'address',
  'postCode',
  'mobile',
  'intro',
  'isConsultation',
  'isExpert',
  'specialty',
  'areaCode',
  'education',
  'title',
  'duties',
  'orgCode',
  'idType',
  'idNumber',
  'certificateNo',
  'idUrl',
  'idState',
  'signatureUrl',
  'certificateUrl',
  'imageUrl',
  'height',
  'weight',
  'sort',
  'status',
  'remark',
];

const initstate = getinitstate({ field: fields });

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    updateSetMode,
    updateFormReq,
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
