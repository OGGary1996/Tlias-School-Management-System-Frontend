<script setup>
import { ref } from 'vue';

// 从localStorage获取用户信息
const userInfo = ref(JSON.parse(localStorage.getItem('loginUser') || '{}'));

</script>

<template>
  <div class="homepage-container">
    <!-- 顶部背景图区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>Welcome to Tlias</h1>
        <p>Your Complete School Management Solution</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 系统介绍 -->
      <section class="intro-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon">👥</div>
            <h3>Student Management</h3>
            <p>Efficiently manage student information, attendance, and academic records</p>
          </div>
          <div class="feature-card">
            <div class="icon">👨‍🏫</div>
            <h3>Teacher Management</h3>
            <p>Handle teacher profiles, schedules, and performance tracking</p>
          </div>
          <div class="feature-card">
            <div class="icon">📊</div>
            <h3>Data Analysis</h3>
            <p>Generate insights with comprehensive analytics and reporting tools</p>
          </div>
          <div class="feature-card">
            <div class="icon">📚</div>
            <h3>Course Management</h3>
            <p>Organize courses, curricula, and academic programs effectively</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.homepage-container {
  min-height: 100vh;
  background: #f8fafc;
  overflow-x: hidden;
}

/* 顶部背景图区域 */
.hero-section {
  height: 75vh;
  max-height: 700px;
  background: url('@/assets/homepage-bg.png') no-repeat center 30%;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 20px;
  margin: 0 auto;
  max-width: 1400px;
  border-radius: 0 0 30px 30px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  border-radius: 0 0 30px 30px;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding-bottom: 10vh;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 20px;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-content p {
  font-size: 1.5rem;
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: -35vh auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

/* 系统介绍部分 */
.intro-section {
  background: white;
  padding: 40px 50px;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.intro-section h2 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 16px;
  font-weight: 700;
}

.intro-section > p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 50px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
  padding: 0 20px;
}

.feature-card {
  background: white;
  padding: 24px 15px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
}

.feature-card .icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 600;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 10px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 65vh;
    border-radius: 0 0 20px 20px;
  }

  .hero-content {
    padding-bottom: 8vh;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.2rem;
  }

  .main-content {
    margin-top: -30vh;
    padding: 0 15px;
  }

  .intro-section {
    padding: 30px 20px;
    border-radius: 20px;
  }

  .intro-section h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .feature-card {
    padding: 20px;
  }
}
</style>