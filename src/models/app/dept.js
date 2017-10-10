import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as usersService from '../../services/app/dept';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';
// 处理 onError 的函数
import { retry } from '../../utils/requesterror';

const initstate = {
  errorType: null,
  errorAction: null,
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
    filters: {
      channel_id: [],
    },
  },
  set: {
    tableSize: 'middle',
    tableSelected: [],
    fullColumns: ['医院科室ID', '科室名称', '科室简介', '医院ID', '父科室 ', '楼层', '科室地址'],
    tableColumns: [],
    columnModal: {
      visible: false,
    },
    rowClicked: [],
  },
};

export default {

  namespace: 'appdept',

  state: initstate,

  reducers: {
    // 每个页面都有这 3 个，而且内容都一样
    resetstate(state) {
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
    // 表格设置
    // 设置表格展示尺寸
    tableSize(state, action) {
      return update(state, {
        set: {
          tableSize: {
            $set: action.payload,
          },
        },
      });
    },
    // 显示隐藏表格列设置模态框
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
    // 设置显示的表格列
    setTableColumns(state, action) {
      return update(state, {
        set: {
          tableColumns: {
            $set: (action.payload) ? action.payload : state.set.fullColumns,
          },
        },
      });
    },
    // 表格
    // 点击过的行变样式
    recordRowClick(state, action) {
      return update(state, {
        set: {
          rowClicked: {
            $push: [action.payload],
          },
        },
      });
    },
    // 当前选中的行
    rowSelected(state, action) {
      return update(state, {
        set: {
          tableSelected: {
            $set: action.payload,
          },
        },
      });
    },
    // 重置表格（一般在请求前）
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
    // 更新表格数据
    updateTable(state, action) {
      return update(state, {
        res: {
          rows: {
            $set: action.payload,
          },
        },
      });
    },
    // 更新分页数据
    updatePages(state, action) {
      return update(state, {
        req: {
          page: {
            $set: action.payload,
          },
        },
      });
    },
    // 筛选
    // 清除所有筛选条件
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
    // 表格自带筛选，排序
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
    // 搜索筛选
    // 选择搜索项
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
    // 设置搜索关键字
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
    // 表单筛选
    // 设置时间段筛选
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
  },

  effects: {
    *fetch(action, { call, put, select }) {
      yield put({ type: 'resetTable' });

      const options = yield select(state => state.appdept.req);

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
    },
    *batchDelete(action, { call, put, select }) {
      const tableSelected = yield select(state => state.appdept.set.tableSelected);
      const dataSource = yield select(state => state.appdept.res.rows);
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
        if (removelocal(pathname) === '/app/dept') {
          dispatch({ type: 'fetch', payload: { index: 1, size: 20 },
          });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
