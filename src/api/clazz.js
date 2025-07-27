import request from '@/utils/request'

// 定义条件分页查询的函数
const getClazzListByCondition = (name,beginDate,endDate,page,pageSize) => request.get(`/clazzes?page=${page}&pageSize=${pageSize}&name=${name}&beginDate=${beginDate}&endDate=${endDate}`);
// 导出方法
export {getClazzListByCondition};

// 定义新增班级的函数
const insertClazzInfo = (clazzForm) => request.post('/clazzes', clazzForm);
// 导出方法
export {insertClazzInfo};

// 定义修改班级的函数
// 1. 回显
const getClazzById = (id) => request.get(`/clazzes/${id}`);
// 2. 修改
const updateClazzByCondition = (clazzForm) => request.put('/clazzes',clazzForm);
// 导出方法
export {getClazzById, updateClazzByCondition};

// 定义删除班级的函数
const deleteClazzById = (ids) => request.delete(`/clazzes?ids=${ids}`);
// 导出方法
export {deleteClazzById};