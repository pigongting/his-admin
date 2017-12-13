import Mock from 'mockjs';
import { apiPrefix, apiNexfix } from './config';

const deptlist = [
  [
    {
      value: 1,
      label: '内科',
      leaf: true,
    },
    {
      value: 2,
      label: '儿科',
      leaf: true,
    },
    {
      value: 3,
      label: '妇产科',
      leaf: true,
    },
    {
      value: 4,
      label: '外科',
      leaf: true,
    },
    {
      value: 5,
      label: '皮肤性病科',
      leaf: true,
    },
    {
      value: 6,
      label: '中医科',
      leaf: true,
    },
    {
      value: 7,
      label: '口腔科',
      leaf: true,
    },
    {
      value: 8,
      label: '耳鼻喉头颈科',
      leaf: true,
    },
    {
      value: 9,
      label: '眼科',
      leaf: true,
    },
    {
      value: 10,
      label: '骨科',
      leaf: true,
    },
    {
      value: 11,
      label: '肿瘤科',
      leaf: true,
    },
    {
      value: 12,
      label: '精神心理科',
      leaf: true,
    },
    {
      value: 13,
      label: '其他科室',
      leaf: true,
    },
  ],
  [
    {
      value: 1101,
      label: '风湿科',
      leaf: false,
    },
    {
      value: 1102,
      label: '肝炎肠道科',
      leaf: false,
    },
    {
      value: 1103,
      label: '呼吸内科',
      leaf: false,
    },
    {
      value: 1104,
      label: '甲状腺疾病',
      leaf: false,
    },
    {
      value: 1105,
      label: '老年科',
      leaf: false,
    },
    {
      value: 1106,
      label: '内分泌科',
      leaf: false,
    },
    {
      value: 1107,
      label: '神经内科',
      leaf: false,
    },
    {
      value: 1108,
      label: '肾内科',
      leaf: false,
    },
    {
      value: 1109,
      label: '特诊老年科',
      leaf: false,
    },
    {
      value: 1110,
      label: '特诊内科',
      leaf: false,
    },
    {
      value: 1111,
      label: '消化内科',
      leaf: false,
    },
    {
      value: 1112,
      label: '心内科',
      leaf: false,
    },
    {
      value: 1113,
      label: '眩晕科',
      leaf: false,
    },
    {
      value: 1114,
      label: '血透专病门诊',
      leaf: false,
    },
    {
      value: 1115,
      label: '血液内科',
      leaf: false,
    },
  ],
];

const depttree = deptlist[0];
depttree[0].children = deptlist[1];

module.exports = {
  [`POST ${apiPrefix}dept/getOneLevelDeptList${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: deptlist[req.body.value],
    });
  },
  [`POST ${apiPrefix}dept/getAllDeptList${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: depttree,
    });
  },
};
