import React from 'react';
import update from 'immutability-helper';
import * as usersService from '../services/index';
// 处理 国际化地址 的函数
import { removelocal } from '../utils/localpath';
// 处理 onError 的函数
import { retry } from '../utils/requesterror';

const initstate = {
  columns: [
    { title: '属性名', dataIndex: 'attrName' },
    { title: '属性值', dataIndex: 'attrValue' },
    { title: '模块码', dataIndex: 'modelCode' },
    { title: '部分码', dataIndex: 'partsCode' },
    { title: '部分ID', dataIndex: 'partsId' },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: () => <a href="abc.html">编辑</a>,
    },
  ],
  rows: [],
  page: {},
};

export default {

  namespace: 'index',

  state: initstate,

  reducers: {
    fetcherror(state, action) {
      console.log(state);
      console.log(action);
      console.log(update);
      return { ...state };
    },
    updateTable(state, action) {
      return update(state, {
        rows: {
          $set: action.payload,
        },
      });
    },
    updatePages(state, action) {
      return update(state, {
        page: {
          $set: action.payload,
        },
      });
    },
  },

  effects: {
    *fetch(action, { call, put, select }) {
      console.log(action);
      const { data, headers } = yield call(usersService.fetch, action, {}, {});
      console.log(data);
      console.log(headers);

      yield put({ type: 'updateTable', payload: data });
      yield put({ type: 'updatePages', payload: headers });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // setTimeout(() => {
      //   retry(dispatch, true);
      // }, 5000);

      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/index') {
          dispatch({ type: 'fetch', payload: query });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
