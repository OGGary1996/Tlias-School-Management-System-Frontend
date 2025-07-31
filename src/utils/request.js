// import axios
import axios from 'axios';
import {ElMessage} from "element-plus";
import router from "@/router/index.js";

// 创建一个 axios 实例
const request = axios.create(
    {
        baseURL: "/api",
        timeout: 6000, // 请求超时时间,本地测试阶段，可以设置较长时间，便于断点调试
    });

// 添加请求拦截器，在每次请求发起前，将token添加到请求头中
request.interceptors.request.use(
    config => { // 成功回调
        // 1.拿到localStorage中的loginUser（包含了id、name、username、token）
        const loginUser = localStorage.getItem('loginUser');
        if (loginUser){
            // 2.截取loginUser中的token部分
            const loginUserObj = JSON.parse(loginUser);
            const token = loginUserObj.token;
            // 3.将token添加到请求头中
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; // 返回配置对象，继续请求
    },
    error => { // 失败回调
    }
);

// 添加响应拦截器，处理相应数据
request.interceptors.response.use( // 接收2个回调函数
    response => {// 成功回调，直接返回数据
        console.log('Response:', response);
        return response.data // 注意：这里返回的是 response.data，所以后续的所有业务代码中不用再使用result.data.data获取数据
    },
    async error => { // 错误回调,进行错误处理，包含状态码为400、500等错误
        console.error('Request Failed:', error); // 打印错误信息
        // 首先判断是否为401状态，如果是401，则是token验证失败权限问题，需要统一处理，跳转到401页面
        if (error.response.status === 401) {
            ElMessage({
                type: 'error',
                message: 'Login expired, please login again.'
            });
            // 跳转到登录页面，并且清除登录状态
            await router.push('/login');
            localStorage.removeItem('loginUser'); // 清除登录用户信息
            return Promise.reject(error); // 阻止后续处理
        }
        // 后端返回了结构化的错误数据，将其包装成统一格式
        if (error.response?.data) {
            // 将错误响应包装成与成功响应相同的格式
            // 这样业务代码就能统一处理了
            return Promise.resolve({
                code: error.response.data.code || 0,
                message: error.response.data.message || `HTTP ${error.response.status} Error`,
                data: error.response.data.data || null,
                // 额外添加状态码信息，便于调试
                httpStatus: error.response.status
            });
        }
    }
);

// 导出 request 实例
export default request;