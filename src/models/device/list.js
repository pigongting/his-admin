import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as usersService from '../../services/index';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';
// 处理 onError 的函数
import { retry } from '../../utils/requesterror';

const initstate = {
  req: {
    page: {
      boolpage: false,
      index: 1,
      size: 20,
      total: 20,
    },
    orders: {
      comp_ctag_name: [0, 'ascend'],
    },
    filters: {
      apply_time: ['=', ['2017-06-06', '2017-07-16']],
    },
    tableFilters: {
      channel_id: ['=', ['自主申请']],
      cat_name: ['=', ['自主申请自主申请']],
    },
    search: {
      key: 'device_name',
      value: ['like', ['深圳市人民医院']],
    },
  },
  res: {
    rows: [],
    filters: [],
  },
  set: {
    tableSize: 'middle',
    tableSelected: [],
    fullColumns: ['商户编号', '商户名称', '渠道来源', '类别', '联系电话', '联系人', '地址', '排序权重', '登录账号管理', '二级域名管理', '状态'],
    tableColumns: [],
    columnModal: {
      visible: false,
    },
    rowClicked: [],
  },
  errorType: null,
};

export default {

  namespace: 'devicelist',

  state: initstate,

  reducers: {
    resetstate(state) {
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
    resetTable(state, action) {
      return update(state, {
        res: {
          rows: {
            $set: [],
          },
        },
        set: {
          tableSelected: {
            $set: [],
          },
          rowClicked: {
            $set: [],
          },
        },
      });
    },
    updateTable(state, action) {
      return update(state, {
        res: {
          rows: {
            $set: action.payload,
          },
        },
      });
    },
    updatePages(state, action) {
      return update(state, {
        req: {
          page: {
            $set: action.payload,
          },
        },
      });
    },
    updateFilters(state, action) {
      return update(state, {
        res: {
          filters: {
            $set: action.payload,
          },
        },
      });
    },
    tableSize(state, action) {
      return update(state, {
        set: {
          tableSize: {
            $set: action.payload,
          },
        },
      });
    },
    searchSelect(state, action) {
      return update(state, {
        req: {
          search: {
            key: {
              $set: action.payload,
            },
          },
        },
      });
    },
    searchFillter(state, action) {
      return update(state, {
        req: {
          search: {
            value: {
              $set: ['like', action.payload],
            },
          },
        },
      });
    },
    applyTimeChange(state, action) {
      return update(state, {
        req: {
          filters: {
            apply_time: {
              $set: ['=', action.payload],
            },
          },
        },
      });
    },
    clearFillter(state, action) {
      return update(state, {
        req: {
          filters: {
            $set: {},
          },
          tableFilters: {
            $set: {},
          },
          orders: {
            $set: {},
          },
          search: {
            $set: initstate.req.search,
          },
        },
      });
    },
    tableChange(state, action) {
      return update(state, {
        req: {
          tableFilters: {
            $set: (() => {
              const tableFilters = {};
              for (const item in action.payload.filter) {
                if (item && action.payload.filter[item].length > 0) {
                  tableFilters[item] = ['=', action.payload.filter[item]];
                }
              }
              return tableFilters;
            })(),
          },
          orders: {
            $set: {
              [action.payload.orders.columnKey]: [0, action.payload.orders.order],
            },
          },
        },
      });
    },
    rowSelected(state, action) {
      return update(state, {
        set: {
          tableSelected: {
            $set: action.payload,
          },
        },
      });
    },
    columnModalVisible(state, action) {
      return update(state, {
        set: {
          columnModal: {
            visible: {
              $set: !(state.set.columnModal.visible),
            },
          },
        },
      });
    },
    setTableColumns(state, action) {
      return update(state, {
        set: {
          tableColumns: {
            $set: (action.payload) ? action.payload : state.set.fullColumns,
          },
        },
      });
    },
    recordRowClick(state, action) {
      return update(state, {
        set: {
          rowClicked: {
            $push: [action.payload],
          },
        },
      });
    },
  },

  effects: {
    *fetch(action, { call, put, select }) {
      yield put({ type: 'resetTable' });

      const options = yield select(state => state.devicelist.req);

      if (action.payload) {
        if (action.payload.index) {
          options.page.index = action.payload.index;
        }

        if (action.payload.size) {
          options.page.size = action.payload.size;
        }
      }

      const { data, headers, filters } = yield call(usersService.fetch, action, {}, options);

      yield put({ type: 'updateTable', payload: data });
      yield put({ type: 'updatePages', payload: headers });
      yield put({ type: 'updateFilters', payload: filters });
    },
    *batchDelete(action, { call, put, select }) {
      const tableSelected = yield select(state => state.devicelist.set.tableSelected);
      const dataSource = yield select(state => state.devicelist.res.rows);
      const newSource = dataSource.filter((item) => {
        return !tableSelected.includes(item.key);
      });

      yield put({ type: 'updateTable', payload: newSource });
      yield put({ type: 'rowSelected', payload: [] });

      const { data } = yield call(usersService.batchDelete, action, {}, tableSelected);
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) === '/device/list') {
          dispatch({
            type: 'fetch',
            payload: {
              index: 1,
              size: 20,
            },
          });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
