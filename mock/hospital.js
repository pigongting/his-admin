import Mock from 'mockjs';
import { apiPrefix, apiNexfix } from './config';

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
  [`POST ${apiPrefix}hospital/getAllHospitalList${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: hospitallist,
    });
  },
};
