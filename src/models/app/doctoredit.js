import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as fetch from '../../services/app/doctor';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';
// 统一的纯函数
import { getinitstate, resetstate, updateFormReq } from '../../reducers/commonForm';

// 页内配置
const pageConfig = {
  namespace: 'appdoctoredit',
  pagepath: '/app/doctoredit',
  field: ['doctorId', 'hospitalId', 'hospitalDeptId', 'doctorName', 'gender', 'marriage', 'birthday', 'doctorCap', 'pcaCode', 'address', 'postCode', 'mobile', 'intro', 'isConsultation', 'isExpert', 'specialty', 'areaCode', 'education', 'title', 'duties', 'orgCode', 'idType', 'idNumber', 'certificateNo', 'idUrl', 'idState', 'signatureUrl', 'certificateUrl', 'imageUrl', 'height', 'weight', 'sort', 'status', 'remark'],
};

// 初始状态
const initstate = getinitstate({
  field: pageConfig.field,
});

initstate.req.doctorName.value = '王丹丹';
initstate.req.pcaCode.value = ['130000', '130100', '130102'];
initstate.res.dept = [{ value: '', label: '加载中...' }];

export default {

  namespace: pageConfig.namespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    updateFormReq,
    updateDeptFillter(state, action) {
      return update(state, {
        res: {
          dept: {
            $set: action.payload,
          },
        },
      });
    },
    updateHospitalFillter(state, action) {
      return update(state, {
        res: {
          hospital: {
            $set: action.payload,
          },
        },
      });
    },
  },

  effects: {
    *insertRow(action, { call, put, select }) {
      const options = yield select(state => state[pageConfig.namespace].req);
      const newoptions = {};

      for (const key in options) {
        if (options[key].value) {
          if (Object.prototype.toString.call(options[key].value) === '[object Array]') {
            newoptions[key] = options[key].value[options[key].value.length - 1];
          } else {
            newoptions[key] = options[key].value;
          }
        }
      }

      const { data } = yield call(fetch.insertRow, { errormsg: '插入失败', ...action }, {}, newoptions);
      console.log(data);
    },
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
        const options = yield select(state => state[pageConfig.namespace].res.dept);
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
          console.log(pathname);
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
