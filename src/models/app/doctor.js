import React from 'react';
import update from 'immutability-helper';
// 请求服务
import * as usersService from '../../services/app/doctor';
// 处理 国际化地址 的函数
import { removelocal } from '../../utils/localpath';

// 页内配置
const pageConfig = {
  namespace: 'appdoctor',
  pagepath: '/app/doctor',
  columns: ['医生名称', '医生头衔', '手机号码', '是否会诊', '是否专家 ', '特长', '职称', '状态'],
};

// 初始状态
const initstate = {
  req: {
    page: {
      boolpage: true,
      index: 1,
      size: 20,
      total: 20,
    },
    search: {
      key: 'doctorName',
      value: ['like', ['']],
    },
    filters: {},
    tableFilters: {},
    orders: {},
  },
  res: {
    rows: [],
    filters: {
      channel_id: [],
    },
  },
  set: {
    rowClicked: [],
    tableSelected: [],
    fullColumns: pageConfig.columns,
    tableColumns: pageConfig.columns,
  },
};

export default {

  namespace: pageConfig.namespace,

  state: initstate,

  reducers: {
    // 每个页面都有这 3 个，而且内容都一样
    resetstate(state) {
      return update(state, {
        $set: initstate,
      });
    },
    // 表格设置
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
    updateFormFillter(state, action) {
      const filters = {};
      let searchkey = '';
      let searchvalue = '';

      for (const key in action.payload) {
        if (action.payload[key]) {
          switch (key) {
            case 'searchkey':
              searchkey = action.payload[key];
              break;
            case 'searchvalue':
              searchvalue = action.payload[key];
              break;
            default:
              try {
                filters[key] = ['between', [action.payload[key][0].format('YYYY-MM-DD HH:mm:ss'), action.payload[key][1].format('YYYY-MM-DD HH:mm:ss')]];
              } catch (e) {
                filters[key] = ['=', [action.payload[key]]];
              }
              break;
          }
        }
      }

      return update(state, {
        req: {
          filters: {
            $set: filters,
          },
          search: {
            key: {
              $set: searchkey,
            },
            value: {
              $set: ['like', [searchvalue]],
            },
          },
        },
      });
    },
  },

  effects: {
    *fetch(action, { call, put, select }) {
      yield put({ type: 'resetTable' });
      const options = yield select(state => state[pageConfig.namespace].req);

      options.page.index = (action.payload && action.payload.index) ? action.payload.index : options.page.index;
      options.page.size = (action.payload && action.payload.size) ? action.payload.size : options.page.size;

      const { data, headers } = yield call(usersService.fetch, { errormsg: '表格数据请求失败', ...action }, {}, options);

      yield put({ type: 'updateTable', payload: data });
      yield put({ type: 'updatePages', payload: headers });
    },
    *batchDelete(action, { call, put, select }) {
      const tableSelected = yield select(state => state[pageConfig.namespace].set.tableSelected);
      const dataSource = yield select(state => state[pageConfig.namespace].res.rows);
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
        if (removelocal(pathname) === pageConfig.pagepath) {
          dispatch({ type: 'fetch', payload: { index: 1, size: 20 } });
        } else {
          dispatch({ type: 'resetstate' });
        }
      });
    },
  },

};
