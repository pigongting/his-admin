const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;

const deptlist = [
  [
    {
      hospitalDeptId: 1,
      deptName: '内科',
      leaf: true,
    },
    {
      hospitalDeptId: 2,
      deptName: '儿科',
      leaf: true,
    },
    {
      hospitalDeptId: 3,
      deptName: '妇产科',
      leaf: true,
    },
    {
      hospitalDeptId: 4,
      deptName: '外科',
      leaf: true,
    },
    {
      hospitalDeptId: 5,
      deptName: '皮肤性病科',
      leaf: true,
    },
    {
      hospitalDeptId: 6,
      deptName: '中医科',
      leaf: true,
    },
    {
      hospitalDeptId: 7,
      deptName: '口腔科',
      leaf: true,
    },
    {
      hospitalDeptId: 8,
      deptName: '耳鼻喉头颈科',
      leaf: true,
    },
    {
      hospitalDeptId: 9,
      deptName: '眼科',
      leaf: true,
    },
    {
      hospitalDeptId: 10,
      deptName: '骨科',
      leaf: true,
    },
    {
      hospitalDeptId: 11,
      deptName: '肿瘤科',
      leaf: true,
    },
    {
      hospitalDeptId: 12,
      deptName: '精神心理科',
      leaf: true,
    },
    {
      hospitalDeptId: 13,
      deptName: '其他科室',
      leaf: true,
    },
  ],
  [
    {
      hospitalDeptId: 1101,
      deptName: '风湿科',
      leaf: false,
    },
    {
      hospitalDeptId: 1102,
      deptName: '肝炎肠道科',
      leaf: false,
    },
    {
      hospitalDeptId: 1103,
      deptName: '呼吸内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1104,
      deptName: '甲状腺疾病',
      leaf: false,
    },
    {
      hospitalDeptId: 1105,
      deptName: '老年科',
      leaf: false,
    },
    {
      hospitalDeptId: 1106,
      deptName: '内分泌科',
      leaf: false,
    },
    {
      hospitalDeptId: 1107,
      deptName: '神经内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1108,
      deptName: '肾内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1109,
      deptName: '特诊老年科',
      leaf: false,
    },
    {
      hospitalDeptId: 1110,
      deptName: '特诊内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1111,
      deptName: '消化内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1112,
      deptName: '心内科',
      leaf: false,
    },
    {
      hospitalDeptId: 1113,
      deptName: '眩晕科',
      leaf: false,
    },
    {
      hospitalDeptId: 1114,
      deptName: '血透专病门诊',
      leaf: false,
    },
    {
      hospitalDeptId: 1115,
      deptName: '血液内科',
      leaf: false,
    },
  ],
];

module.exports = {
  [`POST ${apiPrefix}/dept/getAllDeptList`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: deptlist[req.body.hospitalDeptId],
    });
  },
};
