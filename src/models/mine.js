import React from 'react';
import update from 'immutability-helper';
// antd 组件
import { notification, Button } from 'antd';
// 处理 国际化地址 的函数
import { removelocal } from '../utils/localpath';
// 处理 onError 的函数
import { retry } from '../utils/requesterror';

// 初始状态
const initstate = {};

export default {

  namespace: 'mine',

  state: initstate,

  reducers: {
    resetstate(state) {
      console.log(state);
      console.log(initstate);
      return initstate;
    },
  },

  effects: {},

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/mine') {
          console.log(removelocal(pathname));
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
