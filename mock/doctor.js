import Mock from 'mockjs';
import { apiPrefix, apiNexfix } from './config';

const doctorlist = [
  {
    doctorId: 1,
    hospitalId: 1,
    hospitalDeptId: 1101,
    doctorName: '路晓燕',
    gender: false,
    marriage: 1,
    birthday: '1950-11-24 00:00:00',
    doctorCap: '副主任医师',
    pcaCode: 440304,
    address: '深圳市福田区莲花路1120号',
    postCode: '518000',
    mobile: '15862541256',
    intro: null,
    isConsultation: true,
    isExpert: true,
    specialty: null,
    areaCode: null,
    education: null,
    title: '副主任医师',
    duties: null,
    orgCode: null,
    idType: null,
    idNumber: null,
    certificateNo: null,
    idUrl: null,
    idState: 1,
    signatureUrl: null,
    certificateUrl: null,
    imageUrl: null,
    height: null,
    weight: null,
    sort: null,
    status: 1,
    remark: null,
    treeExStr: '1-1101',
  },
];

module.exports = {
  [`POST ${apiPrefix}doctor/getDoctorList${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: doctorlist,
    });
  },
  [`POST ${apiPrefix}doctor/getDoctorById${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: doctorlist[0],
    });
  },
  [`POST ${apiPrefix}doctor/insertDoctor${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: null,
    });
  },
  [`POST ${apiPrefix}doctor/updateDoctor${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: null,
    });
  },
  [`POST ${apiPrefix}doctor/deleteDoctor${apiNexfix}`](req, res) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: null,
    });
  },
};
