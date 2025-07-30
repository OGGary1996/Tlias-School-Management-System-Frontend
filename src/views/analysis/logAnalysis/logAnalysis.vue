<script setup>
import { ref,onMounted } from 'vue'
import {DeleteFilled, Loading, MoreFilled, Search, Warning} from "@element-plus/icons-vue";
// 引入api请求
import {getAllOperationLogsByCondition} from '@/api/analysis.js'
import {getAllEmployees} from '@/api/employee.js'
import {ElMessage} from "element-plus";

// 显示日志列表
// 定义响应式变量，接收日志数据
const logList = ref([]);
// 表格中需要按照isSuccess的值来设置行的颜色
const tableRowClassName = ({row}) => {
  if (row.isSuccess === 0) {
    return 'warning-row'
  } else {
    return 'success-row'
  }
};

// 定义核心方法，获取日志数据
const getLogList = async () => {
  const results = await getAllOperationLogsByCondition(
      searchForm.value.operateEmpId,
      searchForm.value.operateEmpName,
      searchForm.value.operateTime,
      searchForm.value.javaClassName,
      searchForm.value.javaMethodName,
      searchForm.value.isSuccess,
      currentPage.value,
      pageSize.value);
  if (results.code === 1) {
    logList.value = results.data.records; // 获取日志记录
    total.value = results.data.total; // 获取总记录数
  }else{
    ElMessage.error('Failed to fetch log list');
  }
};
onMounted(() => {getLogList()});

// 条件搜索部分：
// 定义响应式变量，接收搜索条件
const searchForm = ref({
  operateEmpId: '',
  operateEmpName: '',
  operateTime: '',
  javaClassName: '',
  javaMethodName: '',
  isSuccess: ''
});
// 搜索框中需要下拉列表显示员工的id与姓名
const employeeList = ref([]);
const getEmployeeList = async () => {
  const results = await getAllEmployees();
  if (results.code === 1){
    employeeList.value = results.data;
  }else{
    ElMessage.error('Failed to fetch employee list');
  }
};
// 挂载时获取员工列表
onMounted(() => {
  getEmployeeList();
})
// 定义搜索方法
const search = () => {
  getLogList();
}
// 定义重置搜索条件方法
const resetSearchForm = () => {
  searchForm.value = {
    operateEmpId: '',
    operateEmpName: '',
    operateTime: '',
    javaClassName: '',
    javaMethodName: '',
    isSuccess: ''
  };
  getLogList();
};


// 分页部分：
// 定义响应式变量，用于分页
const currentPage = ref(1); // 默认当前页为1
const pageSize = ref(10); // 默认每页显示10条数据
const total = ref(0); // 总数据条数，默认为0，等待API返回
const background = ref(true); // 分页组件的背景色，默认为true
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  // 当每页条数变化时，重新请求数据
  getLogList();

};
const handleCurrentChange = (newCurrentPage) => {
  currentPage.value = newCurrentPage;
  // 当页码变化时，重新请求数据
  getLogList();
};


</script>

<template>
  <div class="log-container">
    <h2>📃Log Management</h2>
    <!-- 条件搜索框 -->
    <div class="search-form">
      <el-form :model="searchForm" class="search-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Operator ID" prop="operateEmpId">
              <el-select v-model="searchForm.operateEmpId">
                <el-option
                    v-for="emp in employeeList" :key="emp.id"
                    :label="emp.id"
                    :value="emp.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Operator Name" prop="operateEmpName">
              <el-select v-model="searchForm.operateEmpName">
                <el-option
                    v-for="emp in employeeList" :key="emp.id"
                    :label="emp.name"
                    :value="emp.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Operate After" prop="operateTime">
              <el-date-picker
                  v-model="searchForm.operateTime"
                  type="datetime"
                  placeholder="Select date and time"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Is Success" prop="isSuccess">
              <el-select v-model="searchForm.isSuccess">
                <el-option label="Success" :value="1"/>
                <el-option label="Failed" :value="0"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Operate Java Class" prop="javaClassName">
              <el-input v-model="searchForm.javaClassName" placeholder="Enter class name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Operate Java Method" prop="javaMethodName">
              <el-input v-model="searchForm.javaMethodName" placeholder="Enter method name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="search"><el-icon><Search /></el-icon>&nbsp;Search</el-button>
              <el-button type="info" @click="resetSearchForm"><el-icon><Loading /></el-icon>&nbsp;Reset</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 主表格，显示日志列表 -->
    <div class="log-list">
      <el-table :data="logList" :row-class-name="tableRowClassName" width="100%" center>
        <el-table-column prop="id" label="Operate ID"  width="100px" align="center"></el-table-column>
        <el-table-column prop="operateEmpId" label="Operator ID"  width="110px" align="center"></el-table-column>
        <el-table-column prop="operateEmpName" label="Operator Name"  width="150px" align="center"></el-table-column>
        <el-table-column prop="operateTime" label="Operate Time" width="220px" align="center"></el-table-column>
        <el-table-column prop="javaClassName" label="Operate Class Name" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="javaMethodParams" label="Operate Method Params" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="javaMethodReturn" label="Operate Method Returns" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="costTime" label="Cost Time(ms)" width="150px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Status" width="100px" align="center">
          <template #default="scope">
            <span v-if="scope.row.isSuccess === 1">Success</span>
            <span v-else>Failed</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination-block">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[5, 10, 20, 30]"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

<style scoped>
.log-container .search-form{
  margin: 10px 0;
}
.buttons{
  margin: 10px 0;
}
.log-list{
  margin: 10px 0;
}
.pagination-block{
  margin: 10px 0;
  text-align: center;
}
</style>