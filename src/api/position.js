// 引入 request对象
import request from '@/utils/request.js'

// 定义方法，获取职位列表
const listAllPositions = () => request.get('/positions');
// 导出方法
export { listAllPositions };

// 定义方法，新增职位
const createPosition = (positionForm) => request.post('/positions', positionForm);
// 导出方法
export { createPosition };

// 定义方法，更新职位
// 1.回显职位
const getPositionById = (id) => request.get(`/positions/${id}`);
// 2.修改职位
const updatePositionById = (positionForm) => request.put('/positions', positionForm);
// 导出方法
export { getPositionById, updatePositionById };

// 定义方法，删除职位
const deletePositionById = (id) => request.delete(`/positions/${id}`);
// 导出方法
export { deletePositionById };