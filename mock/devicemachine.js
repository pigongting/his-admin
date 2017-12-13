import Mock from 'mockjs';
import { apiPrefix, apiNexfix } from './config';

const deptlist = [
  {
    key: 1,
    id: 1,
    mcode: '474116454615',
    modelCode: 'Y-456',
    modelName: '极速',
    position: '儿科',
    layingDirectorName: '张丽',
    supervisorName: '王力豪',
    state: '正常',
  },
  {
    key: 2,
    id: 2,
    mcode: '474895645451',
    modelCode: 'Y-456',
    modelName: '极速',
    position: '中医科',
    layingDirectorName: '张丽',
    supervisorName: '王力豪',
    state: '正常',
  },
  {
    key: 3,
    id: 3,
    mcode: '951214561248',
    modelCode: 'Y-456',
    modelName: '极速',
    position: '妇科',
    layingDirectorName: '张丽',
    supervisorName: '王力豪',
    state: '缺纸',
  },
  {
    key: 4,
    id: 4,
    mcode: '951214561248',
    modelCode: 'Y-456',
    modelName: '极速',
    position: '内科',
    layingDirectorName: '张丽',
    supervisorName: '王力豪',
    state: '正常',
  },
  {
    key: 5,
    id: 5,
    mcode: '951214561248',
    modelCode: 'Y-456',
    modelName: '极速',
    position: '外科',
    layingDirectorName: '张丽',
    supervisorName: '王力豪',
    state: '正常',
  },
];

module.exports = {
  'POST /api/v1/devicemachine/list': (req, res) => {
    res.status(200).json({
      code: 0,
      msg: '',
      data: {
        index: 1,
        rows: deptlist,
        size: 20,
        total: 5,
      },
    });
  },
};
