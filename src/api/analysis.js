import request from '@/utils/request'

// 获取员工的部门分布情况
const departmentEmployeeReport = () => request.get('/reports/department-employee-count');
// 获取员工的岗位分布情况
const positionEmployeeReport = () => request.get('/reports/position-employee-count');
// 获取员工的性别分布情况
const employeeGenderReport = () => request.get('/reports/employee-gender-count');
// 导出
export {departmentEmployeeReport, positionEmployeeReport, employeeGenderReport};

// 获取学生的学历分布情况
const studentDegreeReport = () => request.get('/reports/student-degree-count');
// 获取学生的班级分布情况
const studentClazzReport = () => request.get('/reports/student-clazz-count');
// 导出
export {studentDegreeReport, studentClazzReport};

// 获取所有的操作日志
const getAllOperationLogsByCondition = (operateEmpId,operateEmpName,operateTime,javaClassName,javaMethodName,isSuccess,page,pageSize) => request.get(`/operation-log?operateEmpId=${operateEmpId}&operateEmpName=${operateEmpName}&operateTime=${operateTime}&javaClassName=${javaClassName}&javaMethodName=${javaMethodName}&isSuccess=${isSuccess}&page=${page}&pageSize=${pageSize}`);
// 导出
export {getAllOperationLogsByCondition};