import { setup, getinitstate, resetstate, updateSetMode, updateFormReq } from '../../reducers/commonForm';
import { fetchDeptFillter, updateDeptFillter } from '../../reducers/app/dept';
import { fetchHospitalFillter, updateHospitalFillter } from '../../reducers/app/hospital';
import { fetchGetRow, fetchInsertRow, fetchUpdateRow } from '../../reducers/app/doctor';

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
    updateDeptFillter,
    updateHospitalFillter,
  },

  effects: {
    fetchGetRow: (action, { call, put, select }) => fetchGetRow(action, { call, put, select }, pagespace),
    fetchInsertRow: (action, { call, put, select }) => fetchInsertRow(action, { call, put, select }, pagespace),
    fetchUpdateRow: (action, { call, put, select }) => fetchUpdateRow(action, { call, put, select }, pagespace),
    fetchDeptFillter: (action, { call, put, select }) => fetchDeptFillter(action, { call, put, select }, pagespace),
    fetchHospitalFillter: (action, { call, put, select }) => fetchHospitalFillter(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
