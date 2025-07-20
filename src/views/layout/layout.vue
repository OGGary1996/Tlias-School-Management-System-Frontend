<script setup>
import { ref } from 'vue'
import {
  Finished,
  SwitchButton,
  Edit,
  School,
  House,
  UserFilled,
  HomeFilled,
  Setting,
  Avatar, PieChart, Histogram, OfficeBuilding, Orange, Files, Platform, Suitcase
} from '@element-plus/icons-vue'
// 用户信息
const userInfo = ref({
  name: 'Admin',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!--Header-->
      <el-header class="header">
        <div class="header-content">
          <!-- 左侧系统标题 -->
          <div class="header-left">
            <el-icon class="logo-icon" size="28">
              <Finished />
            </el-icon>
            <h1 class="system-title">Tlias School Management System</h1>
          </div>
          
          <!-- 右侧用户信息和按钮 -->
          <div class="header-right">
            <!-- 用户信息 -->
            <div class="user-info">
              <el-avatar 
                :src="userInfo.avatar" 
                class="user-avatar"
                :size="32"
              />
              <span class="user-name">{{ userInfo.name }}</span>
            </div>
            &nbsp;
            <!-- 操作按钮 -->
            <el-button text class="header-btn">
              <el-icon><Edit /></el-icon>
              &nbsp;Change Password
            </el-button>
            <span class="divider">|</span>
            <el-button text class="header-btn logout-btn">
              <el-icon><SwitchButton /></el-icon>
              &nbsp;Logout
            </el-button>
          </div>
        </div>
      </el-header>

      <!--sub-container-->
      <el-container>
        <!--Aside-->
        <el-aside class="aside" width="280px">
          <el-menu :default-openeds="['/manage', '/system', '/analysis']" router>
            <el-menu-item index="/home">
              <el-icon><House /></el-icon>Home
            </el-menu-item>
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><School /></el-icon>Class & Student Management
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>Class Management
              </el-menu-item>
              <el-menu-item index="/student">
                <el-icon><UserFilled /></el-icon>Student Management
              </el-menu-item>
              <el-menu-item index="/subject">
                <el-icon><Platform /></el-icon>Subject Management
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Setting /></el-icon>System Info Management
              </template>
              <el-menu-item index="/department">
                <el-icon><OfficeBuilding /></el-icon>Department Management
              </el-menu-item>
              <el-menu-item index="/employee">
                <el-icon><Avatar /></el-icon>Employee Management
              </el-menu-item>
              <el-menu-item index="/position">
                <el-icon><Suitcase /></el-icon>Position Management
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/analysis">
              <template #title>
                <el-icon><PieChart /></el-icon>Data Analysis
              </template>
              <el-menu-item index="/employeeAnalysis">
                <el-icon><Histogram /></el-icon>Employee Analysis
              </el-menu-item>
              <el-menu-item index="/studentAnalysis">
                <el-icon><Orange /></el-icon>Student Analysis
              </el-menu-item>
              <el-menu-item index="/logAnalysis">
                <el-icon><Files /></el-icon>Log Analysis
              </el-menu-item>
            </el-sub-menu>

          </el-menu>

        </el-aside>
        <!--Main-->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>

  </div>
</template>

<style scoped>
/* Header 样式 */
.header {
  background: linear-gradient(135deg, #87ceeb 0%, #dda0dd 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
}

/* 左侧logo区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #ffffff;
}

.system-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
}

/* 按钮样式 */
.header-btn {
  color: #ffffff !important;
  font-weight: 500;
  border: none !important;
  background: none !important;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 6px;
  transform: translateY(-1px);
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2) !important;
  color: #ff6b6b !important;
}

/* 分割线 */
.divider {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 300;
}

/* 其他容器样式 */
.aside {
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.main {
  background-color: #ffffff;
  padding: 20px;
}

.common-layout {
  height: 100vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .system-title {
    display: none;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .user-name {
    display: none;
  }
  
  .header-btn span {
    display: none;
  }
  
  .divider {
    display: none;
  }
}
</style>