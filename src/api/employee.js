// 引入request对象
import request from '@/utils/request'

// 定义条件分页查询的函数
// 注意：虽然后端采用了 EmployeeQueryParam 对象用于封装查询的参数，
// 但是前端仍然使用的是请求参数的形式传递参数，后端Spring会自动封装请求参数到 EmployeeQueryParam 中
const getEmployeeListByCondition = (name,gender,startDate,endDate,page,pageSize) =>
    request.get(`/employees?name=${name}&gender=${gender}&startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`);
// 导出函数
export { getEmployeeListByCondition };

// 定义添加员工的函数
const createEmployee = (employeeForm) => request.post('/employees',employeeForm);
// 导出函数
export { createEmployee };

// 定义编辑员工的函数
// 1. 员工回显
const getEmployeeById = (id) => request.get(`/employees/${id}`);
// 2. 更新员工
const updateEmployee = (employeeForm ) => request.put('/employees', employeeForm);
// 导出函数
export { getEmployeeById, updateEmployee };

// 定义删除员工的函数
const deleteEmployee = (ids) => request.delete(`/employees?ids=${ids}`);
// 导出函数
export { deleteEmployee };