import React from 'react';
import update from 'immutability-helper';
// 处理 国际化地址 的函数
import { removelocal } from '../utils/localpath';

const initstate = {
  errorType: null,
  errorAction: null,
  req: {
    username: {
      value: '466548808@qq.com',
    },
    password: {
      value: '123456',
    },
  },
};

export default {

  namespace: 'login',

  state: initstate,

  reducers: {
    resetstate(state, action) {
      return update(state, {
        $set: initstate,
      });
    },
    fetcherror(state, action) {
      console.log(state);
      console.log(action);

      return update(state, {
        errorAction: {
          $set: action.erroraction.type,
        },
        errorType: {
          $set: action.erroraction.errortype,
        },
      });
    },
    clearerror(state, action) {
      return update(state, {
        errorAction: {
          $set: (state.errorAction === action.payload) ? null : state.errorAction,
        },
        errorType: {
          $set: (state.errorAction === action.payload) ? null : state.errorType,
        },
      });
    },
  },

  effects: {},

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/login') {
          console.log(removelocal(pathname));
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
