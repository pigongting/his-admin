import update from 'immutability-helper';

// 通用状态
export function getinitstate({ columntags, searchkey }) {
  return {
    req: {
      page: {
        boolpage: true,
        index: 1,
        size: 20,
        total: 20,
      },
      search: {
        key: searchkey,
        value: ['like', ['']],
      },
      filters: {},
      tableFilters: {},
      orders: {},
    },
    res: {
      rows: [],
      filters: {},
    },
    set: {
      fullColumns: columntags,
      showColumns: columntags,
    },
  };
}

// 恢复页面状态
export function resetstate(state, initstate) {
  return update(state, {
    $set: initstate,
  });
}

// 清除表格数据
export function resetTable(state, action) {
  return update(state, {
    res: {
      rows: {
        $set: [],
      },
    },
  });
}

// 更新表格数据
export function updateTable(state, action) {
  return update(state, {
    res: {
      rows: {
        $set: action.payload,
      },
    },
  });
}

// 更新分页数据
export function updatePages(state, action) {
  return update(state, {
    req: {
      page: {
        $set: action.payload,
      },
    },
  });
}

// 设置表格显示列
export function setTableColumns(state, action) {
  return update(state, {
    set: {
      showColumns: {
        $set: (action.payload) ? action.payload : state.set.fullColumns,
      },
    },
  });
}

// 筛选
// 表格自带筛选，排序
export function updateTableFillter(state, action) {
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
        $set: (() => {
          const neworders = {};
          if (action.payload.orders.columnKey) {
            neworders[action.payload.orders.columnKey] = [0, action.payload.orders.order];
          }
          return neworders;
        })(),
      },
    },
  });
}

// 表单自定义筛选
export function updateFormFillter(state, action) {
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
            if (Object.prototype.toString.call(action.payload[key]) === '[object Array]') {
              filters[key] = ['=', action.payload[key]];
            } else {
              filters[key] = ['=', [action.payload[key]]];
            }
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
}

export function *fetchTableData(action, { call, put, select }, namespace, fetchmothed) {
  yield put({ type: 'resetTable' });
  const options = yield select(state => state[namespace].req);

  options.page.index = (action.payload && action.payload.index) ? action.payload.index : options.page.index;
  options.page.size = (action.payload && action.payload.size) ? action.payload.size : options.page.size;

  const { data, headers } = yield call(fetchmothed, { errormsg: '表格数据请求失败', ...action }, {}, options);

  yield put({ type: 'updateTable', payload: data });
  yield put({ type: 'updatePages', payload: headers });
}

export function *batchDeleteRow(action, { call, put, select }, namespace, fetchmothed) {
  const selectedRows = action.payload;

  // 从表格中删除选中行
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    return !selectedRows.includes(item.key);
  });
  yield put({ type: 'updateTable', payload: newSource });

  // 发送删除请求
  const { data } = yield call(fetchmothed, { errormsg: '删除失败', ...action }, {}, selectedRows);
}
