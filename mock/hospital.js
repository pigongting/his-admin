const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;

const hospitallist = [
  {
    hospitalId: 1,
    hospitalName: '北京大学深圳医院',
  },
  {
    hospitalId: 2,
    hospitalName: '深圳市妇幼保健院',
  },
];

module.exports = {
  [`POST ${apiPrefix}/hospital/getAllHospitalList`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: hospitallist,
    });
  },
};
