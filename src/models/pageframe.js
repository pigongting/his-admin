import update from 'immutability-helper';
// 处理 国际化地址 的函数
import { removelocal, removelocalkeepmain } from '../utils/localpath';

const initstate = {
  collapsed: false,
  subcollapsed: false,
  pageTitle: '',
  mainmenu: [],
  submenu: [],
  submenudata: {},
  menudate: [
    {
      parentid: 0,
      id: 1,
      href: '/index',
      icon: '../assets/img/mainmenu/home.png',
      name: '主页',
    },
    {
      parentid: 0,
      id: 2,
      href: '/product',
      icon: '../assets/img/mainmenu/user.png',
      name: '我的',
      submenu: [
        {
          parentid: 11,
          id: 111,
          href: '/device',
          icon: '../assets/img/mainmenu/home.png',
          name: '设备列表',
        },
        {
          parentid: 1,
          id: 12,
          href: '/users/product',
          icon: '../assets/img/mainmenu/home.png',
          name: '设备列表',
          submenu: [
            {
              parentid: 12,
              id: 121,
              href: '/users/product',
              icon: '../assets/img/mainmenu/home.png',
              name: '设备列表',
            },
          ],
        },
      ],
    },
    {
      parentid: 0,
      id: 3,
      href: '/device',
      icon: '../assets/img/mainmenu/machine.png',
      name: '设备',
      submenu: [
        {
          parentid: 11,
          id: 111,
          href: '/device/detail',
          icon: '../assets/img/mainmenu/home.png',
          name: '新增设备',
        },
        {
          parentid: 1,
          id: 12,
          href: '/users/product',
          icon: '../assets/img/mainmenu/home.png',
          name: '设备列表',
          submenu: [
            {
              parentid: 12,
              id: 121,
              href: '/users/product',
              icon: '../assets/img/mainmenu/home.png',
              name: '设备列表',
            },
          ],
        },
      ],
    },
    {
      href: '/users/product',
      icon: '../assets/img/mainmenu/app.png',
      name: '应用',
    },
    {
      href: '/users/product',
      icon: '../assets/img/mainmenu/member.png',
      name: '人员',
    },
    {
      href: '/users/product',
      icon: '../assets/img/mainmenu/finance.png',
      name: '财务',
    },
    {
      href: '/users/product',
      icon: '../assets/img/mainmenu/system.png',
      name: '系统',
    },
  ],
};

export default {

  namespace: 'pageframe',

  state: initstate,

  reducers: {
    toggleCollapsed(state, data) {
      return update(state, {
        collapsed: {
          $set: (data.payload === undefined) ? !(state.collapsed) : data.payload,
        },
      });
    },
    toggleSubCollapsed(state, data) {
      return update(state, {
        subcollapsed: {
          $set: (data.payload === undefined) ? !(state.subcollapsed) : data.payload,
        },
      });
    },
    getMainMunu(state, data) {
      const mainmenuArray = [];
      const submenuArray = {};

      data.payload.map((item, key) => {
        mainmenuArray.push({
          href: item.href,
          icon: item.icon,
          name: item.name,
          submenu: !!item.submenu,
        });

        if (item.submenu) {
          submenuArray[item.href] = item.submenu;
        }

        return undefined;
      });

      return update(state, {
        mainmenu: {
          $push: mainmenuArray,
        },
        submenudata: {
          $set: submenuArray,
        },
      });
    },
    getSubMunu(state, data) {
      return update(state, {
        submenu: {
          $set: state.submenudata[data.payload],
        },
        pageTitle: {
          $set: (() => {
            let name = '';

            state.mainmenu.map((item, key) => {
              if (item.href === data.payload) {
                name = item.name;
              }
              return name;
            });

            return name;
          })(),
        },
      });
    },
  },

  effects: {},

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getMainMunu', payload: initstate.menudate });

      return history.listen(({ pathname, query }) => {
        dispatch({ type: 'getSubMunu', payload: removelocalkeepmain(pathname) });

        if (removelocal(pathname) === '/index') {
          dispatch({ type: 'toggleCollapsed', payload: false });
        } else {
          dispatch({ type: 'toggleCollapsed', payload: true });
        }
      });
    },
  },

};
