import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as fetch from '../../services/app/doctor';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';
// 统一的纯函数
import { getinitstate, resetstate, resetTable, updateTable, updatePages, setTableColumns, updateTableFillter, updateFormFillter, fetchTableData, batchDeleteRow } from '../../reducers/commonFormTable';

// 页内配置
const pageConfig = {
  namespace: 'appdoctor',
  pagepath: '/app/doctor',
  columntags: ['医生名称', '医生头衔', '手机号码', '是否会诊', '是否专家 ', '特长', '职称', '状态'],
};

// 初始状态
const initstate = getinitstate({
  columntags: pageConfig.columntags,
  searchkey: 'doctorName',
});

initstate.res.filters.dept = [{ value: '', label: '加载中...' }];

export default {

  namespace: pageConfig.namespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    resetTable,
    updateTable,
    updatePages,
    setTableColumns,
    updateTableFillter,
    updateFormFillter,
    updateDeptFillter(state, action) {
      return update(state, {
        res: {
          filters: {
            dept: {
              $set: action.payload,
            },
          },
        },
      });
    },
    updateHospitalFillter(state, action) {
      return update(state, {
        res: {
          filters: {
            hospital: {
              $set: action.payload,
            },
          },
        },
      });
    },
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pageConfig.namespace, fetch.tableData),
    batchDeleteRow: (action, { call, put, select }) => batchDeleteRow(action, { call, put, select }, pageConfig.namespace, fetch.deleteRow),
    *fetchHospitalFillter(action, { call, put, select }) {
      const { data } = yield call(fetch.hospitalFillter, { errormsg: '医院列表加载失败', ...action }, {}, {});
      yield put({ type: 'updateHospitalFillter', payload: data });
    },
    *fetchDeptFillter(action, { call, put, select }) {
      const targetOption = action.payload;
      // 转圈
      if (targetOption) { targetOption.loading = true; }
      // 请求数据
      const { data } = yield call(fetch.deptFillter, { errormsg: '科室列表加载失败', ...action }, {}, {
        hospitalDeptId: (targetOption && targetOption.hospitalDeptId) || 0,
      });
      // 处理数据
      data.map((item, index) => {
        const newitem = item;
        newitem.value = item.hospitalDeptId;
        newitem.label = item.deptName;
        newitem.isLeaf = !item.leaf;
        return newitem;
      });
      // 改变状态
      if (targetOption) {
        targetOption.loading = false;
        targetOption.children = data;
        const options = yield select(state => state[pageConfig.namespace].res.filters.dept);
        yield put({ type: 'updateDeptFillter', payload: [...options] });
      } else {
        yield put({ type: 'updateDeptFillter', payload: data });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === pageConfig.pagepath) {
          dispatch({ type: 'fetchTableData', payload: { index: 1, size: 20 } });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
