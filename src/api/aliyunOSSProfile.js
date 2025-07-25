import request from '@/utils/request'

// 定义阿里云OSS上传头像的请求方法
// 注意：上传文件不需要定义单独请求，由于使用了el-upload组件，其中的action属性已经指定了上传的URL，并且会自动发送上传的请求。

// 定义阿里云OSS删除头像的请求方法,注意不要使用路径参数，URL使用路径参数会出错
const deleteAvatar = (imageURL) => {
    return request.delete('/file/delete/employee/image/oss', {
        params: { fileURL: imageURL }
    });
};// 导出函数
export { deleteAvatar };