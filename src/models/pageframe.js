import update from 'immutability-helper';

const initstate = {
  collapsed: false,
};

export default {

  namespace: 'pageframe',

  state: initstate,

  reducers: {
    toggleCollapsed(state, data) {
      return update(state, {
        collapsed: {
          $set: !(state.collapsed),
        },
      });
    },
  },

  effects: {},

  subscriptions: {},

};
