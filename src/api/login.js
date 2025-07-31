import request from '@/utils/request'

// 用户登录
const login = (loginForm) => request.post('/login', loginForm);
export {login};