import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as usersService from '../../services/index';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';

const initstate = {
  errorType: null,
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

  namespace: 'deviceedit',

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
        errorType: {
          $set: action.erroraction.type,
        },
      });
    },
    clearerror(state, action) {
      return update(state, {
        errorType: {
          $set: (state.errorType === action.payload) ? null : state.errorType,
        },
      });
    },
  },

  effects: {
    *batchDelete(action, { call, put, select }) {
      const { data } = yield call(usersService.batchDelete, action, {}, {
        username: 'justin.tan',
        password: 'Justin76.tan',
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/device/edit') {
          console.log(removelocal(pathname));
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
