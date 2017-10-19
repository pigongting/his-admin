import update from 'immutability-helper';

// 初始状态
export function getinitstate({ columntags }) {
  return {
    req: {
      page: {
        boolpage: true,
        index: 1,
        size: 20,
        total: 20,
      },
      formFilters: {},
      tableFilters: {},
      orders: {},
    },
    res: {
      rows: [],
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

// 更新表格筛选请求参数
export function updateTableFillter(state, action) {
  console.log(action);

  return update(state, {
    req: {
      tableFilters: { $set: {} },
      orders: { $set: { [action.tableSorter.field]: [0, action.tableSorter.order] } },
    },
  });
}

// 更新表单筛选请求参数
export function updateFormFillter(state, action) {
  const newFormFilters = { ...state.req.formFilters };

  for (const key in action.payload) {
    if (action.payload[key]) {
      newFormFilters[key] = { value: action.payload[key] };
    }
  }

  return update(state, { req: { formFilters: { $set: newFormFilters } } });
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
