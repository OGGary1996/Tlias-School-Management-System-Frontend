import request from '@/utils/request'

// 定义获取所有的学科的函数
const getAllSubjects = () => request.get('/subjects');
// 导出函数
export { getAllSubjects };