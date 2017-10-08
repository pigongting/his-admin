import update from 'immutability-helper';
// 处理 国际化地址 的函数
import { removelocal, removelocalkeepmain, removelocalkeepsub, removelocalkeepthree } from '../utils/localpath';

const initstate = {
  mainSiderCollapsed: false,
  subSiderCollapsed: false,
  pageTitle: '',
  mainmenu: [],
  submenu: [],
  submenudata: {},
  menuSelect: {
    main: [],
    sub: [],
    open: [],
  },
  menudate: [
    {
      parentid: 0,
      id: 1,
      link: '/index',
      icon: '/assets/img/mainmenu/home.png',
      name: '主页',
    },
    {
      parentid: 0,
      id: 2,
      link: '/mine',
      icon: '/assets/img/mainmenu/user.png',
      name: '我的',
    },
    {
      parentid: 0,
      id: 3,
      icon: '/assets/img/mainmenu/machine.png',
      name: '设备',
      submenu: [
        {
          parentid: 3,
          id: 31,
          link: '/device/list',
          icon: '/assets/img/mainmenu/home.png',
          name: '设备列表',
        },
        {
          parentid: 3,
          id: 32,
          icon: '/assets/img/mainmenu/home.png',
          name: '设备属性',
          submenu: [
            {
              parentid: 32,
              id: 321,
              link: '/device/prop/list',
              icon: '/assets/img/mainmenu/home.png',
              name: '属性列表',
            },
            {
              parentid: 32,
              id: 322,
              link: '/device/prop/list',
              icon: '/assets/img/mainmenu/home.png',
              name: '属性列表',
            },
          ],
        },
      ],
    },
    {
      parentid: 0,
      id: 4,
      link: '/users/product',
      icon: '/assets/img/mainmenu/app.png',
      name: '应用',
    },
    {
      parentid: 0,
      id: 5,
      link: '/users/product',
      icon: '/assets/img/mainmenu/member.png',
      name: '人员',
    },
    {
      parentid: 0,
      id: 6,
      link: '/users/product',
      icon: '/assets/img/mainmenu/finance.png',
      name: '财务',
    },
    {
      parentid: 0,
      id: 7,
      link: '/users/product',
      icon: '/assets/img/mainmenu/system.png',
      name: '系统',
    },
  ],
};

export default {

  namespace: 'pageframe',

  state: initstate,

  reducers: {
    toggleMainSiderCollapsed(state, data) {
      return update(state, {
        mainSiderCollapsed: {
          $set: data.payload,
        },
      });
    },
    toggleSubSiderCollapsed(state, data) {
      return update(state, {
        subSiderCollapsed: {
          $set: data.payload,
        },
      });
    },
    getMainMenu(state, data) {
      const mainmenuArray = [];
      const submenuArray = {};

      data.payload.map((item, key) => {
        const itemParams = item;
        const mainmenuItem = { ...item };

        mainmenuItem.submenu = !!item.submenu;

        if (item.submenu) {
          if (item.submenu[0].submenu) {
            mainmenuItem.link = item.submenu[0].submenu[0].link;
            itemParams.link = item.submenu[0].submenu[0].link;
          } else {
            mainmenuItem.link = item.submenu[0].link;
            itemParams.link = item.submenu[0].link;
          }

          item.submenu.map((subitem, subindex) => {
            const subitemParams = subitem;

            if (subitem.submenu) {
              subitemParams.link = subitem.submenu[0].link;
            }

            return undefined;
          });
        }

        mainmenuArray.push(mainmenuItem);

        if (item.submenu) {
          submenuArray[removelocalkeepmain(item.link)] = item.submenu;
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
    getSubMenu(state, data) {
      let mainmenuItem = {};

      state.mainmenu.map((item, key) => {
        if (removelocalkeepmain(item.link) === data.payload) {
          mainmenuItem = item;
        }
        return mainmenuItem;
      });

      return update(state, {
        submenu: {
          $set: state.submenudata[data.payload],
        },
        pageTitle: {
          $set: mainmenuItem.name,
        },
      });
    },
    setSelectMenu(state, data) {
      let openmenuItem = [];
      let mainmenuItem = [];
      let submenuItem = [];

      state.mainmenu.map((item, key) => {
        if (removelocalkeepmain(item.link) === removelocalkeepmain(data.payload)) {
          mainmenuItem = [`${item.id}`];
        }
        return undefined;
      });

      const submenu = state.submenudata[removelocalkeepmain(data.payload)];
      if (submenu) {
        submenu.map((item, key) => {
          if (removelocalkeepsub(item.link) === removelocalkeepsub(data.payload)) {
            if (item.submenu) {
              item.submenu.map((threeitem, threekey) => {
                if (removelocalkeepthree(threeitem.link) === removelocalkeepthree(data.payload)) {
                  submenuItem = [`${threeitem.id}`];
                  openmenuItem = [`${item.id}`];
                }
                return undefined;
              });
            } else {
              submenuItem = [`${item.id}`];
            }
          }

          return undefined;
        });
      }

      return update(state, {
        menuSelect: {
          main: {
            $set: mainmenuItem,
          },
          sub: {
            $set: submenuItem,
          },
          open: {
            $set: openmenuItem,
          },
        },
      });
    },
    submenuChange(state, data) {
      return update(state, {
        menuSelect: {
          open: {
            $set: data.payload,
          },
        },
      });
    },
  },

  effects: {},

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getMainMenu', payload: initstate.menudate });

      return history.listen(({ pathname, query }) => {
        dispatch({ type: 'getSubMenu', payload: removelocalkeepmain(pathname) });
        dispatch({ type: 'setSelectMenu', payload: pathname });

        if (removelocal(pathname) === '/index') {
          dispatch({ type: 'toggleMainSiderCollapsed', payload: false });
        } else {
          dispatch({ type: 'toggleMainSiderCollapsed', payload: true });
        }
      });
    },
  },

};
