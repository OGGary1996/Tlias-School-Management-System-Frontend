// import axios
import axios from 'axios';

// 创建一个 axios 实例
const request = axios.create(
    {
        baseURL: "/api",
        timeout: 6000, // 请求超时时间,本地测试阶段，可以设置较长时间，便于断点调试
    });

// 添加请求拦截器，处理相应数据
request.interceptors.response.use( // 接收2个回调函数
    response => {
        console.log('Response:', response);
        return response.data
    }, // 成功回调，直接返回数据
    error => { // 错误回调,进行错误处理，包含状态码为400、500等错误
        console.error('Request Failed:', error); // 打印错误信息
        // 如果后端返回了结构化的错误数据，将其包装成统一格式
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
        
        // 网络错误或无法解析的错误，返回统一格式
        return Promise.resolve({
            code: 0,
            message: error.message || 'Network Error',
            data: null,
            httpStatus: error.response?.status || 0
        });
    }
);

// 导出 request 实例
export default request;