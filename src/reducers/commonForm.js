import update from 'immutability-helper';

// 通用状态
export function getinitstate({ field }) {
  const newreq = {};

  field.map((item, index) => {
    newreq[item] = {
      value: null,
    };
    return item;
  });

  return {
    req: newreq,
    res: {},
  };
}

// 恢复页面状态
export function resetstate(state, initstate) {
  return update(state, {
    $set: initstate,
  });
}

// 表单请求
export function updateFormReq(state, action) {
  const newreq = { ...state.req };

  for (const key in action.payload) {
    if (action.payload[key]) {
      try {
        newreq[key] = {
          value: action.payload[key],
        };
      } catch (e) {
        newreq[key] = {
          value: action.payload[key],
        };
      }
    }
  }

  return update(state, {
    req: {
      $set: newreq,
    },
  });
}
