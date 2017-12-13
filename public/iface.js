const apiPrefix = 'http://192.168.3.201:8080/WiseMedical/';
const apiNexfix = '.do';

const apiPrefixMock = '/api/v1/';
const apiNexfixMock = '';

window.iface = {
  insertDept: `${apiPrefix}dept/insertDept${apiNexfix}`,
  deleteDeptArray: `${apiPrefix}dept/deleteArray${apiNexfix}`,
  updateDept: `${apiPrefix}dept/updateDept${apiNexfix}`,
  getDeptById: `${apiPrefix}dept/getDeptById${apiNexfix}`,
  getDeptList: `${apiPrefix}dept/getDeptList${apiNexfix}`,
  getAllDeptList: `${apiPrefix}dept/getAllDeptList${apiNexfix}`,
  getAllMachine: `${apiPrefixMock}devicemachine/list${apiNexfixMock}`,
  insertHospitalMap: `${apiPrefix}hospitalMap/insertHospitalMap${apiNexfix}`,
  deleteHospitalMapArray: `${apiPrefix}hospitalMap/deleteArray${apiNexfix}`,
  updateHospitalMap: `${apiPrefix}hospitalMap/updateHospitalMap${apiNexfix}`,
  getHospitalMapById: `${apiPrefix}hospitalMap/getHospitalMapById${apiNexfix}`,
  getHospitalMapList: `${apiPrefix}hospitalMap/getHospitalMapList${apiNexfix}`,
  insertDoctor: `${apiPrefix}doctor/insertDoctor${apiNexfix}`,
  deleteDoctorArray: `${apiPrefix}doctor/deleteArray${apiNexfix}`,
  updateDoctor: `${apiPrefix}doctor/updateDoctor${apiNexfix}`,
  getDoctorById: `${apiPrefix}doctor/getDoctorById${apiNexfix}`,
  getDoctorList: `${apiPrefix}doctor/getDoctorList${apiNexfix}`,
  getAllHospitalList: `${apiPrefix}hospital/getAllHospitalList${apiNexfix}`,
};
