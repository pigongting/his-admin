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
          name: '设备列表',
        },
        {
          parentid: 3,
          id: 32,
          link: '/device/parts',
          name: '配件列表',
        },
        {
          parentid: 3,
          id: 33,
          link: '/device/partsprop',
          name: '配件属性列表',
        },
        {
          parentid: 3,
          id: 34,
          link: '/device/model',
          name: '型号列表',
        },
        {
          parentid: 3,
          id: 35,
          link: '/device/group',
          name: '设备组列表',
        },
        {
          parentid: 3,
          id: 36,
          link: '/device/program',
          name: '程序版本列表',
        },
        {
          parentid: 3,
          id: 37,
          link: '/device/programgroup',
          name: '程序版本组列表',
        },
        {
          parentid: 3,
          id: 38,
          link: '/device/state',
          name: '设备状态',
        },
        {
          parentid: 3,
          id: 39,
          link: '/device/log',
          name: '设备日志',
        },
      ],
    },
    {
      parentid: 0,
      id: 4,
      icon: '/assets/img/mainmenu/app.png',
      name: '应用',
      submenu: [
        {
          parentid: 4,
          id: 48,
          link: '/app/dept',
          name: '科室列表',
        },
        {
          parentid: 4,
          id: 49,
          link: '/app/doctor',
          name: '医生列表',
        },
        {
          parentid: 4,
          id: 41,
          name: '就诊卡',
          submenu: [
            {
              parentid: 41,
              id: 411,
              link: '/app/visitingcard/list',
              name: '就诊卡列表',
            },
            {
              parentid: 41,
              id: 412,
              link: '/app/visitingcard/record',
              name: '就诊卡交易记录',
            },
          ],
        },
        {
          parentid: 4,
          id: 42,
          name: '挂号',
          submenu: [
            {
              parentid: 42,
              id: 421,
              link: '/app/findnumber/list',
              name: '挂号列表',
            },
            {
              parentid: 42,
              id: 422,
              link: '/app/canclenumber/list',
              name: '取消挂号记录',
            },
            {
              parentid: 42,
              id: 423,
              link: '/app/getnumber/list',
              name: '取号记录',
            },
          ],
        },
        {
          parentid: 4,
          id: 43,
          link: '/app/clinicfee',
          name: '门诊缴费记录',
        },
        {
          parentid: 4,
          id: 44,
          link: '/app/hospitalfee',
          name: '住院缴费记录',
        },
        {
          parentid: 4,
          id: 45,
          link: '/app/hospitaldeposit',
          name: '住院押金记录',
        },
        {
          parentid: 4,
          id: 46,
          link: '/app/report',
          name: '报告列表',
        },
        {
          parentid: 4,
          id: 47,
          link: '/app/order',
          name: '订单列表',
        },
      ],
    },
    {
      parentid: 0,
      id: 5,
      icon: '/assets/img/mainmenu/member.png',
      name: '人员',
      submenu: [
        {
          parentid: 5,
          id: 51,
          link: '/men/operation',
          name: '运维人员列表',
        },
        {
          parentid: 5,
          id: 52,
          link: '/men/admin',
          name: '管理员列表',
        },
        {
          parentid: 5,
          id: 53,
          link: '/men/user',
          name: '用户列表',
        },
      ],
    },
    {
      parentid: 0,
      id: 6,
      icon: '/assets/img/mainmenu/finance.png',
      name: '财务',
      submenu: [
        {
          parentid: 6,
          id: 61,
          name: '收款账户',
          submenu: [
            {
              parentid: 61,
              id: 611,
              link: '/finance/account/list',
              name: '账户列表',
            },
            {
              parentid: 62,
              id: 612,
              link: '/finance/account/diary',
              name: '账户流水',
            },
          ],
        },
        {
          parentid: 6,
          id: 62,
          link: '/finance/paymethod',
          name: '支付方式',
        },
      ],
    },
    {
      parentid: 0,
      id: 7,
      icon: '/assets/img/mainmenu/system.png',
      name: '系统',
      submenu: [
        {
          parentid: 7,
          id: 71,
          link: '/system/baseinfo',
          name: '医院基本信息',
        },
        {
          parentid: 7,
          id: 72,
          link: '/system/powerlist',
          name: '权限列表',
        },
        {
          parentid: 7,
          id: 73,
          link: '/system/log',
          name: '系统日志',
        },
      ],
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
        // 未登录跳转
        // if (!localStorage.getItem('logintoken') && pathname !== '/zh/login') {
        //   history.replace('/zh/login');
        //   return;
        // }

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
