<script setup>
// 引入请求方法
import { getEmployeeListByCondition ,createEmployee,getEmployeeById, updateEmployee,deleteEmployee} from '@/api/employee';
// 引入position和department的API方法
import {listAllPositions} from "@/api/position";
import {listAllDepartments} from "@/api/department";
// 引入aliyunOSS的API方法
import {deleteAvatar} from "@/api/aliyunOSSProfile.js";
// 引入Vue的响应式API，Element Plus图标组件
import { ref, onMounted,watch } from 'vue';
import {Check, Close, DeleteFilled, Loading, MoreFilled, Plus, Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";



// 条件分页查询部分：
// 定义响应式对象，存储员工列表
const employeeList = ref([]);
// 定义响应式对象，存储搜索条件
const searchForm = ref({
  name: '',
  gender: '',
  dateRange: [],
  startDate: '',
  endDate: ''
});
// 注意：dateRange是一个数组，包含开始和结束日期,所以需要使用watch函数对其进行监听
// 如果dateRange发生变化，则需要更新赋值给startDate和endDate
// watch函数可以监听：1.响应式数据，2.整个响应式对象（补充{deep:true}）,3.响应式对象中的某个属性（第一个参数为 () => 对象中的属性）
// 这里我们需要监听searchForm中的dateRange属性，当其变化时，更新startDate和endDate
watch(() => searchForm.value.dateRange,(newValue) => {
  if (newValue && newValue.length === 2) {
    searchForm.value.startDate = newValue[0];
    searchForm.value.endDate = newValue[1];
  }
},{ immediate: true }); // immediate: true表示在组件挂载时立即执行一次
// 定义核心方法：请求员工列表数据
const fetchEmployeeList = async () => {
  const results = await getEmployeeListByCondition(searchForm.value.name,searchForm.value.gender,searchForm.value.startDate,searchForm.value.endDate,currentPage.value,pageSize.value);
  // 判断是否成功
  // 如果成功：1.更逊员工列表数据，2.更新总的数据条数
  if(results.code === 1){ // 成功
    employeeList.value = results.data.records;
    total.value = results.data.total; // 更新总条数
  }else{
    // 如果失败，提示错误信息
    ElMessage.error(results.message || 'Failed to fetch employee list');
  }
}
// 定义钩子函数，在组件挂载时调用fetchEmployeeList方法
onMounted(() => {
  fetchEmployeeList();
});
// 定义搜索按钮和重置按钮的事件处理函数
const search = () => {
  // 调用fetchEmployeeList方法，传入当前的搜索条件
  fetchEmployeeList();
}
const resetSearchForm = () => {
  // 重置搜索表单
  searchForm.value = {
    name: '',
    gender: '',
    dateRange: [],
    startDate: '',
    endDate: ''
  }
  // 刷新数据列表，空条件查询一次
  fetchEmployeeList();
};

// 定义响应式变量，用于分页
const currentPage = ref(1); // 默认当前页为1
const pageSize = ref(10); // 默认每页显示10条数据
const total = ref(0); // 总数据条数，默认为0，等待API返回
const background = ref(true); // 分页组件的背景色，默认为true
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  // 当每页条数变化时，重新请求数据
  fetchEmployeeList();
};
const handleCurrentChange = (newCurrentPage) => {
  currentPage.value = newCurrentPage;
  // 当页码变化时，重新请求数据
  fetchEmployeeList();
};




// 新增员工部分：
// 定义响应式变量，管理新增/修改员工的dialog的显示状态和标题
const dialogVisible = ref(false);
const dialogTitle = ref('');

// 定义响应式对象，存储新增员工的表单数据
// 注意：这里的employeeForm是一个对象，包含了员工的所有信息，并且包含另外一个对象数组：员工的过往工作经历
// 1.员工工作经验对象
const employeeHistoryForm = ref({
  dateRange: [],
  startDate: '',
  endDate: '',
  jobTitle: '',
  companyName: ''
});
// 定义watch函数，监听employeeHistoryForm中的dateRange属性，当其变化时，更新startDate和endDate
watch( () => employeeHistoryForm.value.dateRange, (newValue) => {
  if (newValue && newValue.length === 2) {
    employeeHistoryForm.value.startDate = newValue[0];
    employeeHistoryForm.value.endDate = newValue[1];
  }
}, { immediate: true }
);
// 2.员工表单对象
const employeeForm = ref({
  id: '',
  username:'',
  name: '',
  gender:'',
  phone: '',
  jobTitle: '',
  salary: '',
  departmentId: '',
  entryDate: '',
  image: '',
  employeeHistoryUpdateDTOList:[]
});

// 定义el-form的ref对象，用于表单验证
const elFormRef = ref();
// 定义表单验证规则
const rules = {
  username: [
    {required: true, message: 'Username is required', trigger: 'blur'},
    {min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur'}
  ],
  name: [
    {required: true, message: 'Name is required', trigger: 'blur'},
    {min: 2, max: 50, message: 'Name must be between 2 and 50 characters', trigger: 'blur'}
  ],
  gender: [
    {required: true, message: 'Gender is required', trigger: 'blur'},
  ],
  // phone只能是数字，并且只能是10位
  phone: [
    { required: true, message: 'Phone number is required', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: 'Wrong Pattern', trigger: 'blur' }
  ],
  jobTitle: [
    {required: true, message: 'Job Title is required', trigger: 'blur'},
  ],
  salary: [
    {required: true, message: 'Salary is required', trigger: 'blur'},
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Salary must be a valid number with up to 2 decimal places',
      trigger: 'blur'
    }
  ],
  departmentId: [
    {required: true, message: 'Department is required', trigger: 'blur'},
  ],
  entryDate: [
    {required: true, message: 'Entry Date is required', trigger: 'blur'},
  ],
  dateRange: [
    {required: true, message: 'Date Range is required', trigger: 'blur'},
  ],
  companyName: [
    {required: true, message: 'Company is required', trigger: 'blur'},
    {min:2, max: 100, message: 'Company name must be between 2 and 100 characters', trigger: 'blur'}
  ],
  previousJobTitle: [
    {required: true, message: 'Previous Job Title is required', trigger: 'blur'},
    {min:2, max: 50, message: 'Previous Job Title must be between 2 and 50 characters', trigger: 'blur'}
  ]
};

// 定义对象，首先获取到所有的职位和部门列表，用于填充dialog中的下拉列表
const positionList = ref([]);
const departmentList = ref([]);
// 以下两个方法在dialog被打开时调用，获取职位和部门列表，填充dialog中的下拉列表
const fetchPositionList = async () => {
  const result = await listAllPositions();
  if (result.code === 1) {
    positionList.value = result.data;
  } else {
    ElMessage.error(result.message || 'Failed to fetch position list');
  }
};
const fetchDepartmentList = async () => {
  const result = await listAllDepartments();
  if (result.code === 1) {
    departmentList.value = result.data;
  } else {
    ElMessage.error(result.message || 'Failed to fetch department list');
  }
};

// 定义文件上传相关的函数
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('Avatar image must be in JPG or PNG format!');
    return false; // 阻止上传
  }else if (rawFile.size / 1024 / 1024 > 5){ // 大于5MB
    ElMessage.error('Avatar image size cannot exceed 5MB!');
    return false; // 阻止上传
  }
};
const handleAvatarSuccess = (response ) => { // response表示上传放行之后后端返回的结果
  if(response.code === 1){
    ElMessage({
      message: `Successfully uploaded avatar image!`,
      type: 'success',
    })
    // 将上传成功的图片地址赋值给employeeForm.image
    employeeForm.value.image = response.data; // 后端返回的data是图片的URL
  }else(
    ElMessage.error(response.message || 'Failed to upload avatar image!')
  )
};

// 定义函数，用于添加员工工作经历之后动态添加表单项
// 本质上，动态添加表单项目就是将新的工作经历对象添加到employeeForm.employeeHistoryUpdateDTOList数组中
// 因为Vue是基于数据驱动的，所以只需要修改employeeForm.employeeHistory数组即可
// 然后，通过绑定表单项与employeeForm.employeeHistory数组中的数据进行v-for遍历，实现了动态添加表单项的效果
const addEmployeeHistory = () => {
  // 使用展开运算符将employeeHistoryForm的值添加到employeeForm.employeeHistory数组中
  // 注意：这里需要使用深拷贝的方式，避免直接引用导致数据，不能直接使用employeeHistoryForm.value
  employeeForm.value.employeeHistoryUpdateDTOList.push({ ... employeeHistoryForm.value})
};
const deleteEmployeeHistory = (index) => {
  employeeForm.value.employeeHistoryUpdateDTOList.splice(index, 1);
}

// 定义响应式变量与函数，用于点击新增按钮打开dialog
const openCreateDialog = async () => {
  dialogTitle.value = 'Create Employee';
  // 重置表单数据
  employeeForm.value ={
    username: '',
    name: '',
    gender: '',
    phone: '',
    jobTitle: '',
    salary: '',
    departmentId: '',
    entryDate: '',
    image: '',
    employeeHistoryUpdateDTOList:[]
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 获取到职位和部门列表
  await fetchPositionList();
  await fetchDepartmentList();
  dialogVisible.value = true;
};

// 定义确认按钮的事件处理函数
// 流程：1.表单验证，2.发起请求，3.获取结果并进行判断，4.如果成功，则显示消息、清空表单项和验证、关闭dialog、刷新显示，5.失败则显示错误消息
const confirm = () => {
  elFormRef.value.validate( async (valid) => { // 调用el-form的validate方法进行表单验证
    if (!valid){ // 不通过
      ElMessage.error('Please correct the errors in the form before submitting.');
      return;
    }
    // 如果通过验证，则执行后续操作
    // 首先判断是新增还是编辑操作
    if (dialogTitle.value === 'Create Employee') { // 如果是新增操作
      const result = await createEmployee(employeeForm.value);
      if (result.code === 1){
        ElMessage({
          message: `Successfully create new employee!`,
          type: 'success',
        });
        // 重置表单数据
        employeeForm.value ={
          username: '',
          name: '',
          gender: '',
          phone: '',
          jobTitle: '',
          salary: '',
          departmentId: '',
          entryDate: '',
          image: '',
          employeeHistoryUpdateDTOList:[]
        };
        // 将验证规则重置,
        if(elFormRef.value){  // 确保此时DOM已经完全渲染
          elFormRef.value.clearValidate();
        }
        dialogVisible.value = false;
        // 关闭dialog之后，刷新显示员工列表
        await fetchEmployeeList();
      }else{
        ElMessage.error(result.message || 'Failed to create employee');
      }
    }else { // 如果是编辑操作
      const result = await updateEmployee(employeeForm.value)
      if (result.code === 1){
        ElMessage({
          message: `Successfully update employee information!`,
          type: 'success',
        });
        // 重置表单数据
        employeeForm.value ={
          username: '',
          name: '',
          gender: '',
          phone: '',
          jobTitle: '',
          salary: '',
          departmentId: '',
          entryDate: '',
          image: '',
          employeeHistoryUpdateDTOList:[]
        };
        // 将验证规则重置,
        if(elFormRef.value){  // 确保此时DOM已经完全渲染
          elFormRef.value.clearValidate();
        }
        dialogVisible.value = false;
        // 关闭dialog之后，刷新显示员工列表
        await fetchEmployeeList();
      }else{
        ElMessage.error(result.message || 'Failed to create employee');
      }
    }
  });
};
// 定义取消按钮的事件处理函数
// 流程：1.判断是否上传了文件，如果上传了文件，则需要调用接口删除文件，2.清空表单项和验证，3.关闭dialog
const cancel = () => {
  if (dialogTitle === 'Create Employee' && employeeForm.value.image !== ''){ // 如果处于添加员工的dialog并且上传过文件，进行删除操作
    deleteAvatar(employeeForm.value.image);
  }
  // 重置表单数据
  employeeForm.value ={
    username: '',
    name: '',
    gender: '',
    phone: '',
    jobTitle: '',
    salary: '',
    departmentId: '',
    entryDate: '',
    image: '',
    employeeHistoryUpdateDTOList:[]
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  dialogVisible.value = false; // 关闭dialog
};






// 编辑员工部分：
// 定义响应式变量与函数，用于编辑员工信息的事件处理
// 复用新增员工的dialog
const openEditDialog = async (id) => {
  dialogTitle.value = 'Edit Employee';
  // 将验证规则重置
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 获取到职位和部门列表
  await fetchPositionList();
  await fetchDepartmentList();
  // 根据id获取员工信息
  const result = await getEmployeeById(id);
  // 将获取到的员工信息赋值给employeeForm
  if (result.code === 1){
    employeeForm.value = result.data;
    // 注意：此时后端传递回的对象中，员工历史工作数组中的对象没有dateRange属性，所以不会显示时间范围
    // 所以，我们需要单独处理，将数组中的每一个对象中的dateRange赋值
    if (employeeForm.value.employeeHistoryUpdateDTOList && employeeForm.value.employeeHistoryUpdateDTOList.length > 0){ // 如果存在工作经历
      employeeForm.value.employeeHistoryUpdateDTOList.forEach( (history) => {
        history.dateRange = [history.startDate, history.endDate]; // 将startDate和endDate合并为dateRange
      });
    };
    dialogVisible.value = true;
  }else{
    ElMessage.error(result.message || 'Failed to fetch employee information');
  }
}


// 删除员工部分：
const deleteDialogVisible = ref(false); // 控制删除对话框的显示
const deleteDialogTitle = ref(''); // 删除对话框的标题
const employeeToBeDeleted = ref([]); // 用于存储要删除的员工id

// 单个删除部分：
// 定义打开删除对话框的函数
const openDeleteDialog = (id) => {
  deleteDialogTitle.value = 'Delete Employee';
  // 注意：后端的删除接口为批量删除+单个删除共用，接收的参数为id组成的数组
  // 所以此处需要将id存储到employeeToBeDeleted数组中
  employeeToBeDeleted.value = [id]; // 将要删除的员工id存储到数组中
  deleteDialogVisible.value = true; // 打开删除对话框
}

// 批量删除员工部分：
// 定义响应式变量与函数，用于点击复选框的处理
// 在el-table中，使用@selection-change事件来监听选中项的变化，用户每次点击复选框时都会触发这个事件
// 在这个事件处理函数中，我们可以获取到当前选中的行数据-selection，
// selection是一个数组，数组中的元素为当前选中的行的数据对象，而数据对象中包含了所有通过api获取到的员工信息的所有字段
const handleSelectionChange = (selection) => {
  // 将selection中的每一个元素的每一个id属性提取出来，并且存储到employeeToBeDeleted数组中
  // 注意：这里不能使用遍历每个元素的方式获取id，因为：
  //      用户每次点击复选框都会触发这个时间，如果每次都进行遍历获取id，则employeeToBeDeleted数组中每次都会重复添加上一次存在的id
  // 所以：在每次点击复选框时，应该首先清空employeeToBeDeleted数组，然后再将所有选中的行数据的id添加到数组中
  employeeToBeDeleted.value = selection.map(item => item.id);
};

// 定义打开批量删除对话框的函数
const openBatchDeleteDialog = () => {
 deleteDialogTitle.value = 'Batch Delete Employee';
  if (employeeToBeDeleted.value.length === 0) {
    ElMessage.warning('Please select at least one employee to delete.');
    return;
  }
  deleteDialogVisible.value = true; // 打开批量删除对话框
}

// 单个删除与批量删除共用confirmDelete函数
// 定义确认删除按钮的函数
const confirmDelete = async () => {
  const result = await deleteEmployee(employeeToBeDeleted.value);
  if (result.code === 1){
    ElMessage({
      message: 'Employee deleted successfully!',
      type: 'success'
    });
    deleteDialogVisible.value = false; // 关闭删除对话框
    employeeToBeDeleted.value = []; // 清空要删除的员工id数组
    await fetchEmployeeList(); // 刷新员工列表
  } else {
    ElMessage.error('Employee deletion failed: ' + result.message);
  }
};
const cancelDelete = () => {
  deleteDialogVisible.value = false; // 关闭删除对话框
  employeeToBeDeleted.value = []; // 清空要删除的员工id数组
}

</script>

<template>
  <div class="employee-container">
    <h2>👥 Employee Management</h2>
    <!-- 条件搜索框 -->
    <div class="search-form">
      <el-form :model="searchForm" class="search-form" inline>
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchForm.name" placeholder="Please enter name" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="searchForm.gender" placeholder="Please select gender" style="width: 200px">
            <el-option label="Not Specify" value=""/>
            <el-option label="Female" value="0"/>
            <el-option label="Male" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Entry Date" prop="entryDate">
          <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              style="width: 220px"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search"><el-icon><Search /></el-icon>&nbsp;Search</el-button>
          <el-button type="info" @click="resetSearchForm"><el-icon><Loading /></el-icon>&nbsp;Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 新增员工与批量删除员工功能按钮 -->
    <div class="buttons">
      <el-button type="primary" @click="openCreateDialog">+ Create New Employee</el-button>
      <el-button type="primary" @click="openBatchDeleteDialog">- Delete Employees</el-button>
    </div>

    <!-- 主表格，显示员工列表 -->
    <div class="employee-list">
      <el-table :data="employeeList" @selection-change="handleSelectionChange" stripe width="100%" center>
        <el-table-column type="selection" width="55px" />
        <el-table-column prop="name" label="Name"  width="180px" align="center"></el-table-column>
        <el-table-column label="Profile" width="100px" align="center">
          <template #default="scope">
            <img :src="scope.row.image" alt="Avatar" height="50px">
          </template>
        </el-table-column>
        <el-table-column label="Gender" width="100px" align="center">
          <template #default="scope">
            <span v-if="scope.row.gender=== 0">Female</span>
            <span v-else-if="scope.row.gender=== 1">Male</span>
            <span v-else>Not Specify</span>
          </template>
        </el-table-column>
        <el-table-column prop="jobTitle" label="Job Title" width="220px" align="center"></el-table-column>
        <el-table-column prop="departmentName" label="Department" width="150px" align="center"></el-table-column>
        <el-table-column prop="entryDate" label="Entry Date" width="150px" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="Update Time" width="220px" align="center"></el-table-column>
        <el-table-column label="Action" width="220px" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="openEditDialog(scope.row.id)" ><el-icon><MoreFilled /></el-icon>&nbsp;Edit</el-button>
            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row.id)"><el-icon><DeleteFilled /></el-icon>&nbsp;Delete</el-button>
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

    <!-- 新增/修改员工的dialog -->
    <div>
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="65%" center>
        <el-form :model="employeeForm" ref="elFormRef" :rules="rules">
          <!-- username + name -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Username" prop="username">
                <el-input v-model="employeeForm.username"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Name" prop="name">
                <el-input v-model="employeeForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- gender + phone -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Gender" prop="gender">
                <el-select v-model="employeeForm.gender">
                  <el-option :value="null" label="Not Specify"></el-option>
                  <el-option :value="0" label="Female"></el-option>
                  <el-option :value="1" label="Male"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="employeeForm.phone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- jobTitle + salary -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Job Title" prop="jobTitle">
                <el-select v-model="employeeForm.jobTitle">
                  <el-option
                      v-for="position in positionList" :key="position.id"
                      :label="position.name"
                      :value="position.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Salary" prop="salary">
                <el-input v-model="employeeForm.salary"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- departmentId + entryDate -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Department" prop="departmentId">
                <el-select v-model="employeeForm.departmentId" >
                  <el-option
                      v-for="department in departmentList" :key="department.id"
                      :label="department.name"
                      :value="department.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Entry Date" prop="entryDate">
                <el-date-picker
                    v-model="employeeForm.entryDate"
                    type="date"
                    placeholder="Pick a day"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- image -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Avatar" prop="image">
                <el-upload
                    class="avatar-uploader"
                    action="/api/file/upload/employee/image/oss"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                  <img v-if="employeeForm.image" :src="employeeForm.image" class="avatar"  alt="avatar"/>
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- add employee history button -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Employee History">
                <el-button type="success" size="small" @click="addEmployeeHistory">+ Add Employee History</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- employee history -->
          <el-row :gutter="5" v-for="(history,index) in employeeForm.employeeHistoryUpdateDTOList" :key="index" >
            <el-col :span="8">
            <el-form-item label="Time" :prop="`employeeHistoryUpdateDTOList.${index}.dateRange`" :rules="rules.dateRange">
                <el-date-picker
                    v-model="history.dateRange"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Company" :prop="`employeeHistoryUpdateDTOList.${index}.companyName`" :rules="rules.companyName">
                <el-input v-model="history.companyName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Job Title" :prop="`employeeHistoryUpdateDTOList.${index}.jobTitle`" :rules="rules.previousJobTitle">
                <el-input v-model="history.jobTitle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button type="danger" @click="deleteEmployeeHistory(index)">- Delete</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="confirm"><el-icon><Check /></el-icon>&nbsp;Confirm</el-button>
          <el-button @click="cancel"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>
    </div>
    <!-- 删除员工的dialog -->
    <div class="delete-dialog">
      <el-dialog title="Delete Employee" v-model="deleteDialogVisible" width="50%" center >
        <span>
          Are you sure you want to delete this employee? This action cannot be undone.
        </span>
        <template #footer>
          <el-button type="danger" @click="confirmDelete"><el-icon><delete-filled /></el-icon>&nbsp;Delete</el-button>
          <el-button @click="cancelDelete"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<style scoped>
.employee-container .employee-list{
  margin: 10px 0;
}
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>