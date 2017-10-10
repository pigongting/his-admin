const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;

const database = Mock.mock({
  code: 0,
  msg: '',
  data: {
    index: 1,
    size: 20,
    total: 100,
    'rows|20': [
      {
        id: '@id',
        comp_id: 'ZMY002',
        partner_no: '@last',
        'comp_ctag_name|1-2': '自主申请',
        channel_id: '12',
        cat_name: '北京菜',
        comp_phone: '0755-25141364',
        comp_addr: '中国广东省深圳市福田区',
        comp_order: 0,
        partner_admin_num: 1,
        domain: 'shop793903.e690.com',
        comp_status_html: '有效',
      },
    ],
  },
});

const datafillter = Mock.mock({
  code: 0,
  msg: '',
  data: [
    {
      text: '自主申请',
      value: '自主申请',
    },
    {
      text: '自主申请自主申请',
      value: '自主申请自主申请',
    },
  ],
});

module.exports = {
  [`POST ${apiPrefix}/menus`](req, res) {
    database.data.index = req.body.index;
    database.data.size = req.body.size;

    res.status(200).json(database);
  },
  [`POST ${apiPrefix}/menusfillter`](req, res) {
    res.status(200).json(datafillter);
  },
  [`POST ${apiPrefix}/menusDelete`](req, res) {
    res.status(500).json({
      code: 200,
      msg: '',
      data: true,
    });
  },
};
