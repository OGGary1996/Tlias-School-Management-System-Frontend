<script setup>
import { ref,onMounted } from 'vue'

// 引入API
import {studentDegreeReport, studentClazzReport} from '@/api/analysis.js'
import {ElMessage} from "element-plus";


// 学员学历分布情况部分：
const studentDegreeChart = ref({
  title:{
    text: 'Student Degree Distribution',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Degree',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
});
const getStudentDegreeData = async () => {
  const result = await studentDegreeReport();
  if (result.code === 1){
    studentDegreeChart.value.series[0].data = result.data;
  }else {
    ElMessage.error('Failed to fetch student degree data');
  }
};
onMounted(() => {
  getStudentDegreeData();
});


// 员工班级分布情况部分：
// 定义响应式变量 - 表格元素
const studentClazzChart = ref({
  title:{
    text: 'Student Class Distribution',
    left: 'center',
  },
  yAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      show: true,          // 强制显示
      interval: 0,         // 不跳过任何标签
      overflow: 'break',   // 遇到超长文字自动换行
      width: 100,          // 限制标签宽度（自动换行生效）
      lineHeight: 15,      // 设置行高，换行后更美观
      fontSize: 12,        // 字体大小
      fontWeight: 'bold',
    }
  },
  xAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Employee Count',
      data: [],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
});
const getStudentClazzData = async () => {
  const result = await studentClazzReport();
  if (result.code === 1){
    studentClazzChart.value.yAxis.data = result.data.clazzNameList;
    studentClazzChart.value.series[0].data = result.data.countList;
  }else{
    ElMessage.error('Failed to fetch student class data');
  }
};
onMounted(() => {
  getStudentClazzData();
});
</script>

<template>
  <div class="employee-analysis">
    <h2>👨‍🎓 Student Management</h2>
    <!-- 学员学历分布情况 -->
    <div class="chart-container">
      <v-chart :option="studentDegreeChart" autoresize/>
    </div>
    <!-- 学员班级分布情况 -->
    <div class="classChart-container">
      <v-chart :option="studentClazzChart" autoresize/>
    </div>
  </div>
</template>

<style scoped>
.employee-analysis {
  padding: 20px;
}
.chart-container {
  width: 100%;
  height: 500px;
  margin: 10px;
}
.classChart-container{
  width: 100%;
  height: 1500px;
  margin: 10px;
}

</style>