<script setup>
import { ref,onMounted } from 'vue'

// 引入API
import {departmentEmployeeReport, positionEmployeeReport, employeeGenderReport} from '@/api/analysis.js'
import {ElMessage} from "element-plus";


// 员工部门分布情况部分：
// 定义响应式变量 - 表格元素
const employeeDepartmentChart = ref({
  title:{
    text: 'Employee Department Distribution',
    left: 'center',
  },
  yAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      show: true,          // 强制显示
      interval: 0,         // 不跳过任何标签
      overflow: 'break',   // 遇到超长文字自动换行
      width: 120,          // 限制标签宽度（自动换行生效）
      lineHeight: 16,      // 设置行高，换行后更美观
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
const getEmployeeDepartmentData = async () => {
  const result = await departmentEmployeeReport();
  if (result.code === 1){
    employeeDepartmentChart.value.yAxis.data = result.data.departmentNameList;
    employeeDepartmentChart.value.series[0].data = result.data.employeeCountList;
  }else{
    ElMessage.error('Failed to fetch employee department data');
  }
};
onMounted(() => {
  getEmployeeDepartmentData();
});


// 员工岗位分布情况部分：
// 定义响应式变量 - 表格元素
const employeePositionChart = ref({
  title:{
    text: 'Employee Position Distribution',
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
const getEmployeePositionData = async () => {
  const result = await positionEmployeeReport();
  if (result.code === 1){
    employeePositionChart.value.yAxis.data = result.data.positionNameList;
    employeePositionChart.value.series[0].data = result.data.employeeCountList;
  }else{
    ElMessage.error('Failed to fetch employee position data');
  }
};
onMounted(() => {
  getEmployeePositionData();
});


// 员工性别分布情况部分：
const employeeGenderChart = ref({
  title:{
    text: 'Employee Gender Distribution',
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
      name: 'Gender',
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
const getEmployeeGenderData = async () => {
  const result = await employeeGenderReport();
  if (result.code === 1){
    employeeGenderChart.value.series[0].data = result.data;
  }else {
    ElMessage.error('Failed to fetch employee');
  }
};
onMounted(() => {
  getEmployeeGenderData();
});
</script>

<template>
  <div class="employee-analysis">
    <h2>👥 Employee Analysis</h2>
    <!-- 员工部门分布情况 -->
    <div class="chart-container">
      <v-chart :option="employeeDepartmentChart" autoresize/>
    </div>
    <!-- 员工岗位分布情况 -->
    <div class="chart-container">
      <v-chart :option="employeePositionChart" autoresize/>
    </div>
      <!-- 员工性别分布情况 -->
    <div class="chart-container">
      <v-chart :option="employeeGenderChart" autoresize/>
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

</style>