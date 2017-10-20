import update from 'immutability-helper';
import { removelocal } from '../utils/localpath';

// 建立
export function setup({ dispatch, history }, pagepath) {
  return history.listen(({ pathname, query }) => {
    if (removelocal(pathname) !== pagepath) {
      dispatch({ type: 'resetstate' });
    } else {
      dispatch({ type: 'fetchTableData', payload: { index: 1, size: 20 } });
    }
  });
}

// 初始状态
export function getinitstate({ columntags }) {
  return {
    req: {
      page: { boolpage: true, index: 1, size: 20, total: 20 },
      orders: {},
      formFilters: {},
      tableFilters: {},
    },
    res: { rows: [] },
    set: { fullColumns: columntags, showColumns: columntags, clickedRows: [] },
  };
}

// 恢复初始状态
export function resetstate(state, initstate) {
  return update(state, { $set: initstate });
}

// 清除表格数据
function clearAllFiltersAndOrdersFn(state, action) {
  return update(state, { req: { orders: { $set: {} }, formFilters: { $set: {} }, tableFilters: { $set: {} } } });
}

// 清除表格数据
function resetTableFn(state, action) {
  return update(state, { res: { rows: { $set: [] } } });
}

// 更新表格数据
function updateTableFn(state, action) {
  return update(state, { res: { rows: { $set: action.payload } } });
}

// 更新分页数据
function updatePagesFn(state, action) {
  return update(state, { req: { page: { $set: action.payload } } });
}

// 设置表格显示列
function setTableColumnsFn(state, action) {
  return update(state, { set: { showColumns: { $set: (action.payload) ? action.payload : state.set.fullColumns } } });
}

// 记录点击行
function recordClickedRowFn(state, action) {
  return update(state, { set: { clickedRows: { $push: [action.payload] } } });
}

// 更新表格筛选请求参数
function updateTableFillterFn(state, action) {
  console.log(action);

  return update(state, {
    req: {
      tableFilters: { $set: (() => {
        const newTableFilters = {};
        for (const key in action.tableFilters) { if (key) { newTableFilters[key] = action.tableFilters[key]; } }
        return newTableFilters;
      })() },
      orders: { $set: (() => {
        if (action.tableSorter.field) {
          return { [action.tableSorter.field]: action.tableSorter.order };
        } else {
          return {};
        }
      })() },
    },
  });
}

// 更新表单筛选请求参数
function updateFormFillterFn(state, action) {
  const newFormFilters = { ...state.req.formFilters };

  for (const key in action.payload) {
    if (action.payload[key]) {
      newFormFilters[key] = { value: action.payload[key] };
    }
  }

  return update(state, { req: { formFilters: { $set: newFormFilters } } });
}

export const commonFormTableReducers = {
  resetTable: resetTableFn,
  updateTable: updateTableFn,
  updatePages: updatePagesFn,
  setTableColumns: setTableColumnsFn,
  recordClickedRow: recordClickedRowFn,
  updateFormFillter: updateFormFillterFn,
  updateTableFillter: updateTableFillterFn,
  clearAllFiltersAndOrders: clearAllFiltersAndOrdersFn,
};
