import request from '@/utils/request'

// 定义获取所有的学科的函数
const getAllSubjects = () => request.get('/subjects');
// 导出函数
export { getAllSubjects };

// 定义新增学科的函数
const createSubject = (subjectForm) => request.post('/subjects', subjectForm);
// 导出函数
export { createSubject };

// 定义更新学科的函数
// 1. 回显
const getSubjectById = (id) => request.get(`/subjects/${id}`);
// 2. 更新
const updateSubject = (subjectForm) => request.put('/subjects', subjectForm);
// 导出函数
export { getSubjectById, updateSubject };

// 定义删除学科的函数
const deleteSubject = (id) => request.delete(`/subjects/${id}`);
// 导出函数
export { deleteSubject };