const APIV1 = '/api/v1';
const APIV2 = '/api/v2';

module.exports = {
  name: 'AntD Admin',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: [],
  openPages: ['/login'],
  retryErrorType: ['dataError', 'timeout'],
  errorDesc: {
    addressError: '请检查是否写错了请求地址，或者请求地址服务没开',
    requestState: '请检查请求参数，服务器程序',
    dataError: '请检查请求参数，服务器程序',
    timeout: '请检查网络',
  },
  apiPrefix: '/api/v1',
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  },
};
