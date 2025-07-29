import request from '@/utils/request'

// 获取学生列表
const getStudentsByCondition = (name,degree,clazzId,page,pageSize) => request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`);
// 导出方法
export {getStudentsByCondition};

// 新增学生
const createStudent = (studentForm) => request.post('/students', studentForm);
// 导出方法
export {createStudent};

// 更新学生
// 1.回显
const getStudentById = (id) => request.get(`/students/${id}`);
// 2.更新
const updateStudentById = (studentForm) => request.put('/students', studentForm);
// 导出方法
export {getStudentById, updateStudentById};

// 删除学生
const deleteStudentById = (ids) => request.delete(`/students/${ids}`);
// 导出方法
export {deleteStudentById};

// 违纪分数
const updateViolationScoreById = (id,score) => request.put(`/students/violation/${id}/${score}`);
// 导出方法
export {updateViolationScoreById};
