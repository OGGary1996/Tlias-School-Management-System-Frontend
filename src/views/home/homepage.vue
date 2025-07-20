<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  House, 
  School, 
  UserFilled, 
  Avatar, 
  OfficeBuilding, 
  PieChart,
  TrophyBase,
  Calendar,
  Bell
} from '@element-plus/icons-vue'

// 当前时间和问候语
const currentTime = ref(new Date())
const greeting = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})

// 统计数据
const statistics = ref([
  {
    title: 'Total Students',
    value: 2847,
    icon: UserFilled,
    color: '#409EFF',
    trend: '+12.3%'
  },
  {
    title: 'Total Teachers',
    value: 156,
    icon: Avatar,
    color: '#67C23A',
    trend: '+5.2%'
  },
  {
    title: 'Active Classes',
    value: 84,
    icon: School,
    color: '#E6A23C',
    trend: '+8.1%'
  },
  {
    title: 'Departments',
    value: 12,
    icon: OfficeBuilding,
    color: '#F56C6C',
    trend: '+2.0%'
  }
])

// 快速导航
const quickActions = ref([
  { name: 'Student Management', path: '/student', icon: UserFilled, color: '#409EFF' },
  { name: 'Class Management', path: '/clazz', icon: School, color: '#67C23A' },
  { name: 'Employee Management', path: '/employee', icon: Avatar, color: '#E6A23C' },
  { name: 'Department Management', path: '/department', icon: OfficeBuilding, color: '#F56C6C' }
])

// 最新动态
const recentNews = ref([
  {
    title: 'New Semester Registration Opens',
    content: 'Registration for the 2024 Spring semester is now open for all students.',
    time: '2 hours ago',
    type: 'info'
  },
  {
    title: 'Teacher Training Workshop',
    content: 'Professional development workshop scheduled for next week.',
    time: '5 hours ago',
    type: 'success'
  },
  {
    title: 'System Maintenance Notice',
    content: 'Scheduled maintenance will occur this weekend from 2-4 AM.',
    time: '1 day ago',
    type: 'warning'
  }
])

// 学期进度
const semesterProgress = ref(68)

// 更新时间
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})
</script>

<template>
  <div class="homepage">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <el-icon class="welcome-icon"><TrophyBase /></el-icon>
          {{ greeting }}, Admin!
        </h1>
        <p class="welcome-subtitle">Welcome back to Tlias School Management System</p>
        <div class="current-time">
          <el-icon><Calendar /></el-icon>
          {{ currentTime.toLocaleDateString() }} {{ currentTime.toLocaleTimeString() }}
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="statistics-section">
      <el-row :gutter="20">
        <el-col :span="6" v-for="stat in statistics" :key="stat.title">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                <el-icon size="24"><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <h3 class="stat-value">{{ stat.value.toLocaleString() }}</h3>
                <p class="stat-title">{{ stat.title }}</p>
                <span class="stat-trend" :style="{ color: stat.color }">{{ stat.trend }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 快速导航 -->
      <el-col :span="12">
        <el-card class="quick-actions-card" header="Quick Actions">
          <div class="quick-actions">
            <div 
              v-for="action in quickActions" 
              :key="action.name"
              class="action-item"
              @click="$router.push(action.path)"
            >
              <div class="action-icon" :style="{ backgroundColor: action.color }">
                <el-icon size="20"><component :is="action.icon" /></el-icon>
              </div>
              <span class="action-name">{{ action.name }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 学期进度 -->
      <el-col :span="12">
        <el-card class="progress-card" header="Semester Progress">
          <div class="progress-content">
            <div class="progress-info">
              <h3>2024 Spring Semester</h3>
              <p>{{ semesterProgress }}% Complete</p>
            </div>
            <el-progress 
              :percentage="semesterProgress" 
              :stroke-width="12"
              color="#409EFF"
              class="semester-progress"
            />
            <div class="progress-details">
              <div class="detail-item">
                <span>Start Date</span>
                <span>Feb 26, 2024</span>
              </div>
              <div class="detail-item">
                <span>End Date</span>
                <span>Jun 30, 2024</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态区域 -->
    <el-card class="news-card" header="Latest News & Updates">
      <div class="news-content">
        <div 
          v-for="news in recentNews" 
          :key="news.title"
          class="news-item"
        >
          <div class="news-icon">
            <el-icon :class="'news-icon-' + news.type"><Bell /></el-icon>
          </div>
          <div class="news-text">
            <h4 class="news-title">{{ news.title }}</h4>
            <p class="news-description">{{ news.content }}</p>
            <span class="news-time">{{ news.time }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.homepage {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 140px);
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.welcome-icon {
  font-size: 2.5rem;
  color: #ffd700;
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.current-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  opacity: 0.8;
}

/* 统计卡片 */
.statistics-section {
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.stat-title {
  margin: 0 0 5px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

/* 主要内容区域 */
.main-content {
  margin-bottom: 30px;
}

.quick-actions-card,
.progress-card {
  border-radius: 12px;
  border: none;
}

/* 快速导航 */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.action-name {
  font-weight: 500;
  color: #2c3e50;
}

/* 学期进度 */
.progress-content {
  text-align: center;
}

.progress-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.progress-info p {
  margin: 0 0 20px 0;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.semester-progress {
  margin-bottom: 20px;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item span:first-child {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.detail-item span:last-child {
  color: #2c3e50;
  font-weight: 500;
}

/* 最新动态 */
.news-card {
  border-radius: 12px;
  border: none;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.news-item:hover {
  background: #e9ecef;
}

.news-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-icon-info {
  background: #409EFF;
  color: white;
}

.news-icon-success {
  background: #67C23A;
  color: white;
}

.news-icon-warning {
  background: #E6A23C;
  color: white;
}

.news-text {
  flex: 1;
}

.news-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.news-description {
  margin: 0 0 8px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.news-time {
  color: #bdc3c7;
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .statistics-section .el-col {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .progress-details {
    flex-direction: column;
    gap: 10px;
  }
}
</style>