// 引入axios（request）
import request from '../utils/request.js'

// 定义方法，获取部门列表
const listAllDepartments = () => request.get("/departments");
// 导出方法
export { listAllDepartments };

// 定义方法，新增部门
const createDepartment = (departmentForm) => request.post('/departments', departmentForm);
// 导出方法
export { createDepartment };

// 定义方法，更新部门
// 1.回显部门
const getDepartmentById = (id) => request.get(`/departments/${id}`);
// 2.修改部门
const updateDepartmentById = (departmentForm) => request.put('/departments',departmentForm)
// 导出方法
export { getDepartmentById, updateDepartmentById };

// 定义方法，删除部门
const deleteDepartmentById = (id) => request.delete(`/departments/${id}`);
// 导出方法
export { deleteDepartmentById };