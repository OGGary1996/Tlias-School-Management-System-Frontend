<script setup>
import {ref} from 'vue';
import {login} from '@/api/login.js';
import {ElMessage} from "element-plus";
// 调用useRouter，会返回router的实例对象
import {useRouter} from 'vue-router';
// 获取路由实例
const router = useRouter();


// 定义响应式变量，绑定表单
const loginForm = ref({
  username: '',
  password: '',
});
// 定义登录函数
const confirmLogin = async () => {
  // 调用登录接口
  const result = await login(loginForm.value);
  if (result.code === 1){
    ElMessage({
      type: 'success',
      message: 'Login successful!'
    });
    // 保存token到localStorage
    // localStorage中以键值对的形式存储数据(只能是字符串)，通过setItem设置键值对，getItem获取value，removeItem删除键值对
    // 这里把后端传递回来的整个结果对象（包含了id、name、username、image、token）都存储到localStorage中
    localStorage.setItem('loginUser',JSON.stringify(result.data));
    // 登录成功后跳转到/home页面
    await router.push('/home');
    // 清空登录表单
    loginForm.value = {
      username: '',
      password: '',
    };
  }else{
    ElMessage({
      type: 'error',
      message: result.message || 'Login failed, please try again.'
    });
  }
};
// 定义取消登录函数
const cancelLogin = () => {
  loginForm.value = {
    username: '',
    password: '',
  }
}


</script>

<template>
  <div class="login-container">
    <!-- 左侧欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">🧑‍💻 Welcome Back!</h1>
        <h2 class="system-title">📚 Tlias School Management System</h2>
        <p class="welcome-subtitle">Manage your educational data and make teaching more efficient!</p>
      </div>
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <h3>🔑 Login</h3>
          <p>Please enter your username and password 👥</p>
        </div>
        
        <el-form :model="loginForm" class="login-form" size="large">
          <el-form-item>
            <el-input v-model="loginForm.username" placeholder="Username" prefix-icon="User" clearable/>
          </el-form-item>
          
          <el-form-item>
            <el-input v-model="loginForm.password" type="password" placeholder="Password" prefix-icon="Lock" show-password clearable/>
          </el-form-item>
          
          <el-form-item class="form-actions">
            <el-button type="primary" class="login-btn" size="large" :loading="false" @click="confirmLogin">
              Confirm
            </el-button>
            <el-button class="cancel-btn" size="large" @click="cancelLogin">Cancel</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

/* 左侧欢迎区域 */
.welcome-section {
  flex: 2;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 60px;
  position: relative;
  overflow: visible;
  margin-right: -40px;
  z-index: 0;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  background-size: 100px 100px;
  opacity: 0.3;
}

.welcome-content {
  text-align: left;
  color: white;
  z-index: 1;
  position: relative;
  max-width: 600px;
  width: 100%;
}

.welcome-title {
  font-size: 4.2rem;
  font-weight: 800;
  margin: 0 0 24px 0;
  line-height: 1.05;
  letter-spacing: -3px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.system-title {
  font-size: 2.2rem;
  font-weight: 300;
  margin: 0 0 40px 0;
  opacity: 0.95;
  line-height: 1.2;
  letter-spacing: -1px;
  font-style: italic;
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.85;
  margin: 0;
  line-height: 1.6;
  font-weight: 300;
  max-width: 5500px;
}

/* 右侧表单区域 */
.form-section {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h3 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.form-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form .el-input {
  height: 50px;
}

.login-form .el-input__wrapper {
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  box-shadow: none;
  transition: all 0.2s ease;
}

.login-form .el-input__wrapper:hover {
  border-color: #4f46e5;
}

.login-form .el-input__wrapper.is-focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.login-form .el-input__inner {
  font-size: 15px;
}

.form-actions {
  margin-top: 40px;
  padding: 0 20px;
}

.form-actions .el-form-item__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.login-btn, .cancel-btn {
  width: 100%;
  height: 56px;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  margin: 0 0 20px 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  margin-bottom: 0;
}

.login-btn {
  background: #6366f1;
  color: white;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
  background: #4f46e5;
}

.cancel-btn {
  background: #ffffff;
  color: #6b7280;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.cancel-btn:hover {
  background: #f9fafb;
  color: #374151;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .welcome-section {
    flex: none;
    min-height: 45vh;
    padding: 50px 40px;
  }
  
  .welcome-content {
    text-align: center;
    max-width: 100%;
  }
  
  .welcome-title {
    font-size: 3.2rem;
    letter-spacing: -2px;
  }
  
  .system-title {
    font-size: 1.8rem;
  }
  
  .form-section {
    flex: none;
    min-height: 55vh;
    padding: 40px 20px;
    border-radius: 40px 40px 0 0;
    margin-top: -40px;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    min-height: 40vh;
    padding: 40px 30px;
  }
  
  .welcome-title {
    font-size: 2.8rem;
    letter-spacing: -1.5px;
  }
  
  .system-title {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
  
  .form-section {
    padding: 30px 20px;
  }
  
  .form-container {
    max-width: 100%;
  }
}

/* 入场动画 */
.welcome-content {
  animation: slideInLeft 0.8s ease-out;
}

.form-container {
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>