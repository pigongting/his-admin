import React from 'react';
import update from 'immutability-helper';
import * as usersService from '../services/index';
// 处理 国际化地址 的函数
import { removelocal } from '../utils/localpath';
// 处理 onError 的函数
import { retry } from '../utils/requesterror';

const initstate = {
  columns: [
    { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
    { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
    { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
    { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
    { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a href="abc.html">action</a>,
    },
  ],
};

export default {

  namespace: 'index',

  state: initstate,

  reducers: {
    fetcherror(state, action) {
      // console.log(state);
      // console.log(action);
      // console.log(update);
      return { ...state };
    },
  },

  effects: {
    *fetch(action, { call, put, select }) {
      const { productinfo } = yield select(state => state.index);
      const { data, headers } = yield call(usersService.fetch, action, {}, {});
      yield put({ type: 'save', payload: data });

      return { productinfo, data, headers };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // setTimeout(() => {
      //   retry(dispatch, true);
      // }, 5000);

      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/index') {
          // dispatch({ type: 'fetch', payload: query });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
