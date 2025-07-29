<script setup>
// 引入 Vue 和 Element Plus 相关组件
import { ref,onMounted} from "vue";
import {Check, Close, DeleteFilled, Loading, MoreFilled, Search, Warning} from "@element-plus/icons-vue";
// 引入api请求
import {getStudentsByCondition,createStudent,getStudentById, updateStudentById,deleteStudentById,updateViolationScoreById} from "@/api/student.js";
import {getAllClazzes, getAllOngoingAndUpcomingClazzes} from "@/api/clazz.js";
import {ElMessage} from "element-plus";



// 条件分页查询学生列表部分：
// 定义响应式变量，接收学生数据
const studentList = ref([]);
// 定义核心方法，获取学生列表数据
const getStudentList = async () => {
  const results = await getStudentsByCondition(searchForm.value.name,searchForm.value.degree,searchForm.value.clazzId,currentPage.value,pageSize.value);
  if (results.code === 1){
    studentList.value = results.data.records; // 获取学生列表数据
    total.value = results.data.total; // 获取总数据条数
  }else{
    ElMessage.error("Failed to fetch student list data");
  }
};
// 挂载时获取学生列表数据
onMounted(() => {getStudentList()})

// 定义搜索表单数据
const searchForm = ref({
  name: '',
  degree:'',
  clazzId:''
});
// 由于搜索框中clazzId部分需要下拉列表，需要首先获取到班级列表数据
const allClazzList = ref([]);
// 获取班级列表数据
const getAllClazzList = async () => {
  const results = await getAllClazzes();
  if (results.code === 1){
    allClazzList.value = results.data;
  }else{
    ElMessage.error("Failed to fetch class list data");
  }
};
// 挂载时获取班级列表数据
onMounted(() => {getAllClazzList()});
// 定义搜索方法
const search = () => {
  getStudentList();
};
// 定义重置搜索表单方法
const resetSearchForm = () => {
  searchForm.value = {
    name: '',
    degree:'',
    clazzId:''
  };
  getStudentList();
};

// 定义响应式变量，用于分页
const currentPage = ref(1); // 默认当前页为1
const pageSize = ref(10); // 默认每页显示10条数据
const total = ref(0); // 总数据条数，默认为0，等待API返回
const background = ref(true); // 分页组件的背景色，默认为true
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  // 当每页条数变化时，重新请求数据
  getStudentList();

};
const handleCurrentChange = (newCurrentPage) => {
  currentPage.value = newCurrentPage;
  // 当页码变化时，重新请求数据
  getStudentList();
};




// 新增学生部分：
// 定义响应式变量，用于控制新增学生的Dialog属性
const dialogTitle = ref(""); // Dialog标题
const dialogVisible = ref(false); // 控制Dialog的显示与隐藏

// 定义表单对象
const studentForm = ref({
  name: '',
  accountNumber:'',
  gender:'',
  phone: '',
  idCard: '',
  address: '',
  clazzId:'',
  isCollege: '',
  degree: '',
  graduationDate: ''
});
// 定义表单组件的引用对象与校验规则
const elFormRef = ref(null);
const rules = {
  name:[
    { required: true, message: 'Please enter student name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be between 2 and 20', trigger: 'blur' }
  ],
  accountNumber: [
    { required: true, message: 'Please enter account number', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be between 2 and 50', trigger: 'blur' },
    { pattern: /^S.{1,19}$/, message: 'Account number must start with S and be 2-20 characters long', trigger: 'blur' }
  ],
  gender:[
    { required: true, message: 'Please choose gender', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Phone number is required', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: 'Wrong Pattern', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: 'ID Card is required', trigger: 'blur' },
    { pattern: /^\d{15}|\d{18}$/, message: 'Wrong Pattern', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Address is required', trigger: 'blur' },
    { min: 5, max: 255, message: 'Length should be between 5 and 100', trigger: 'blur' }
  ],
  clazzId: [
    { required: true, message: 'Please select class', trigger: 'change' }
  ],
  isCollege: [
    { required: true, message: 'Please select if college', trigger: 'change'}
  ],
  degree: [
    { required: true, message: 'Please select degree', trigger: 'change' }
  ],
  graduationDate: [
    { required: true, message: 'Please select graduation date', trigger: 'change'}
  ]
};

// 由于存在下拉菜单，需要获取到所有状态为Ongoing、Upcoming的班级列表
const ongoingAndUpcomingClazzList = ref([]);
const getOngoingAndUpcomingClazzList = async () => {
  const result = await getAllOngoingAndUpcomingClazzes();
  if (result.code === 1){
    ongoingAndUpcomingClazzList.value = result.data;
  }else{
    ElMessage.error("Failed to fetch ongoing and upcoming class list data");
  }
};

// 定义打开新增学生Dialog方法
const openCreateDialog = () => {
  dialogTitle.value = "Create New Student";
  // 重置表单数据与校验状态
  studentForm.value = {
    name: '',
    accountNumber:'',
    gender:'',
    phone: '',
    idCard: '',
    address: '',
    clazzId:'',
    isCollege: '',
    degree: '',
    graduationDate: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 获取下拉菜单
  getOngoingAndUpcomingClazzList();
  // 显示Dialog
  dialogVisible.value = true;
};

// 定义确认提交方法
const confirm = () => {
  // 校验表单
  elFormRef.value.validate( async (valid) => {
    if (!valid){ // 不通过校验
      ElMessage.error("Please fill in the form correctly");
      return;
    };
    // 通过校验，调用API创建学生
    // 添加一层逻辑判断，判断是新增还是编辑
    let result;
    if (dialogTitle.value === "Create New Student"){
      result = await createStudent(studentForm.value);
    }else{
      result = await updateStudentById(studentForm.value);
    }
    if (result.code === 1){
      ElMessage({
        message: dialogTitle.value === "Create New Student"?  'Student created successfully': 'Student updated successfully',
        type: 'success'
      });
      // 清空表单数据与验证
      // 重置表单数据与校验状态
      studentForm.value = {
        name: '',
        accountNumber:'',
        gender:'',
        phone: '',
        idCard: '',
        address: '',
        clazzId:'',
        isCollege: '',
        degree: '',
        graduationDate: ''
      };
      // 将验证规则重置,
      if(elFormRef.value){  // 确保此时DOM已经完全渲染
        elFormRef.value.clearValidate();
      }
      //关闭dialog
      dialogVisible.value = false;
      // 重新获取学生列表数据
      await getStudentList();
    }else{
      ElMessage.error(dialogTitle.value === "Create New Student"? 'Failed to create student': 'Failed to update student');
    }
  })
};
// 定义取消方法
const cancel = () => {
  // 清空表单数据与验证
  // 重置表单数据与校验状态
  studentForm.value = {
    name: '',
    accountNumber:'',
    gender:'',
    phone: '',
    idCard: '',
    address: '',
    clazzId:'',
    isCollege: '',
    degree: '',
    graduationDate: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 关闭Dialog
  dialogVisible.value = false;
};






// 编辑学生部分：
// 与新增学生共用Dialog，因此只需要定义打开编辑学生Dialog方法
const openEditDialog = async (id) => {
  dialogTitle.value = "Edit Student";
  // 重置表单数据与校验状态
  studentForm.value = {
    name: '',
    accountNumber:'',
    gender:'',
    phone: '',
    idCard: '',
    address: '',
    clazzId:'',
    isCollege: '',
    degree: '',
    graduationDate: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  };
  // 获取下拉菜单
  await getOngoingAndUpcomingClazzList();
  // 获取学生信息
  const result = await getStudentById(id);
  if (result.code === 1){
    studentForm.value = result.data;
    // 显示Dialog
    dialogVisible.value = true;
  }else{
    ElMessage.error("Failed to fetch student data");
  }
}
// 定义确认编辑方法
// 与新增学生的确认方法共用confirm与cancel方法





// 删除学生部分：
// 定义响应式变量，用于控制删除学生的Dialog属性
const deleteDialogTitle = ref(""); // Dialog标题
const deleteDialogVisible = ref(false); // 控制Dialog的显示与隐藏
// 定义响应式变量，接收选中的学生ID
const studentToBeDeleted = ref([]);

// 单个删除学生
// 定义打开删除学生Dialog方法
const openDeleteDialog = (id) => {
  deleteDialogTitle.value = "Delete Student";
  studentToBeDeleted.value = [id]; // 设置要删除的学生ID
  deleteDialogVisible.value = true; // 显示Dialog
};

// 批量删除学生
// 定义复选框行为
const handleSelectionChange = (selection) => {
  studentToBeDeleted.value = selection.map(item => item.id); // 获取选中的学生ID
}
// 定义打开批量删除学生Dialog方法
const openBatchDeleteDialog = () => {
  deleteDialogTitle.value = "Batch Delete Students";
  if (studentToBeDeleted.value.length === 0){
    ElMessage.warning("Please select student to delete");
    return;
  }
  deleteDialogVisible.value = true; // 显示Dialog
}

// 定义确认方法和取消方法
const confirmDelete = async () => {
  const result = await deleteStudentById(studentToBeDeleted.value);
  if (result.code === 1){
    ElMessage({
      message: deleteDialogTitle.value === "Delete Student"? 'Student deleted successfully': 'Students deleted successfully',
      type: 'success'
    });
    studentToBeDeleted.value = [];
    deleteDialogVisible.value = false; // 关闭Dialog
    // 重新获取学生列表数据
    await getStudentList();
  }else{
    ElMessage.error(deleteDialogTitle.value === "Delete Student"? 'Failed to delete student': 'Failed to delete students');
  }
}
const cancelDelete = () => {
  studentToBeDeleted.value = [];
  deleteDialogVisible.value = false; // 关闭Dialog
}





// 学生violation部分：
// 定义响应式变量，接收分数
const violationScore = ref(0); // 接收分数
// 定义响应式变量，接收选中的学生ID
const studentToBeDisciplined = ref(null); // 接收选中的学生ID
const disciplineDialogVisible = ref(false); // 控制Dialog的显示与隐藏

// 定义打开学生违纪Dialog方法
const openDisciplineDialog = (id) => {
  studentToBeDisciplined.value = id;
  disciplineDialogVisible.value = true;
}
// 定义/取消确认违纪方法
const confirmViolate = async () => {
  const result = await updateViolationScoreById(studentToBeDisciplined.value, violationScore.value);
  if (result.code === 1){
    ElMessage.success("Violation score updated successfully");
    violationScore.value = 0; // 重置分数
    disciplineDialogVisible.value = false; // 关闭Dialog
    // 重新获取学生列表数据
    await getStudentList();
  }else{
    ElMessage.error("Failed to update violation score");
  }
}
const cancelViolate = () => {
  violationScore.value = 0; // 重置分数
  disciplineDialogVisible.value = false; // 关闭Dialog
}





</script>

<template>
  <div class="student-container">
    <h2>👨‍🎓 Student Management</h2>
    <!-- 条件搜索框 -->
    <div class="search-form">
      <el-form :model="searchForm" class="search-form" inline>
        <el-form-item label="Name" prop="name">
          <el-input v-model="searchForm.name" placeholder="Please enter name" style="width: 150px"/>
        </el-form-item>
        <el-form-item label="Degree" prop="degree">
          <el-select v-model="searchForm.gender" placeholder="Please select degree" style="width: 180px">
            <el-option label="High School" value="0"/>
            <el-option label="Bachelor" value="1"/>
            <el-option label="Master" value="2"/>
            <el-option label="PhD" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Class Name" prop="clazzId">
          <el-select v-model="searchForm.clazzId" placeholder="Please select class" style="width: 260px">
            <el-option
                v-for="clazz in allClazzList" :key="clazz.id"
                :label="clazz.name"
                :value="clazz.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search"><el-icon><Search /></el-icon>&nbsp;Search</el-button>
          <el-button type="info" @click="resetSearchForm"><el-icon><Loading /></el-icon>&nbsp;Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增员工与批量删除学生功能按钮 -->
    <div class="buttons">
      <el-button type="primary" @click="openCreateDialog">+ Create New Student</el-button>
      <el-button type="primary" @click="openBatchDeleteDialog">- Delete Student</el-button>
    </div>
    <!-- 主表格，显示员工列表 -->
    <div class="student-list">
      <el-table :data="studentList" @selection-change="handleSelectionChange" stripe width="100%" center>
        <el-table-column type="selection" width="55px" />
        <el-table-column prop="name" label="Name"  width="150px" align="center"></el-table-column>
        <el-table-column prop="accountNumber" label="Account Number"  width="150px" align="center"></el-table-column>
        <el-table-column label="Gender" width="100px" align="center">
          <template #default="scope">
            <span v-if="scope.row.gender=== 0">Female</span>
            <span v-else-if="scope.row.gender=== 1">Male</span>
            <span v-else>Not Specify</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Phone" width="200px" align="center"></el-table-column>
        <el-table-column prop="idCard" label="ID Card" width="220px" align="center"></el-table-column>
        <el-table-column prop="address" label="Address" width="220px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="clazzName" label="Class Name" width="250px" align="center"></el-table-column>
        <el-table-column label="Degree" width="100px" align="center">
          <template #default="scope">
            <span v-if="scope.row.degree=== 1">Bachelor</span>
            <span v-else-if="scope.row.degree=== 2">Master</span>
            <span v-else-if="scope.row.degree=== 3">PhD</span>
            <span v-else>High School</span>
          </template>
        </el-table-column>
        <el-table-column prop="graduationDate" label="Graduation Date"  width="150px" align="center"></el-table-column>
        <el-table-column prop="violationCount" label="violation Count"  width="150px" align="center"></el-table-column>
        <el-table-column prop="violationScore" label="violation Score"  width="150px" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="Update Time"  width="200px" align="center"></el-table-column>
        <el-table-column label="Action" width="300px" align="center">
          <template #default="scope">
            <el-button type="info" size="small" @click="openDisciplineDialog(scope.row.id)" ><el-icon><Warning /></el-icon>&nbsp;Discipline</el-button>
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

    <!-- 新增或编辑学生的对话框 -->
    <div class="dialog-container">
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" center>
        <el-form :model="studentForm" ref="elFormRef" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Student Name" prop="name">
                <el-input v-model="studentForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Number" prop="accountNumber">
                <el-input v-model="studentForm.accountNumber"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Gender" prop="gender">
                <el-select v-model="studentForm.gender">
                  <el-option label="Female" :value="0"/>
                  <el-option label="Male" :value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="studentForm.phone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="idCard" prop="idCard">
                <el-input v-model="studentForm.idCard"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Address" prop="address">
                <el-input v-model="studentForm.address"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Class Name" prop="clazzId">
                <el-select v-model="studentForm.clazzId">
                  <el-option
                      v-for="clazz in ongoingAndUpcomingClazzList" :key="clazz.id"
                      :label="clazz.name"
                      :value="clazz.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Is College" prop="isCollege">
                <el-select v-model="studentForm.isCollege">
                  <el-option label="Yes" :value="1"/>
                  <el-option label="No" :value="0"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Degree" prop="clazzId">
                <el-select v-model="studentForm.degree">
                  <el-option label="High School" :value="0"/>
                  <el-option label="Bachelor" :value="1"/>
                  <el-option label="Master" :value="2"/>
                  <el-option label="PhD" :value="3"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Graduation Date" prop="graduationDate">
                <el-date-picker
                    v-model="studentForm.graduationDate"
                    type="date"
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                />
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
    <!-- 单个删除 & 批量删除的对话框 -->
    <div class="dialog-container">
      <el-dialog :title="deleteDialogTitle" v-model="deleteDialogVisible" width="50%" center >
        <span>
          Are you sure you want to delete this student? This action cannot be undone.
        </span>
        <template #footer>
          <el-button type="danger" @click="confirmDelete"><el-icon><delete-filled /></el-icon>&nbsp;Delete</el-button>
          <el-button @click="cancelDelete"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>
    </div>
    <!-- 学生违纪对话框 -->
    <div class="dialog-container">
      <el-dialog title="Discipline" v-model="disciplineDialogVisible" width="50%" center >
        <span>
          Are you sure you want to increase violation score for this student? This action cannot be undone.
        </span>
        <el-form :model="violationScore" inline>
          <el-form-item label="Violation Score">
            <el-input v-model="violationScore"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="danger" @click="confirmViolate"><el-icon><Check /></el-icon>&nbsp;Confirm</el-button>
          <el-button @click="cancelViolate"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.student-container .search-form{
  margin: 10px 0;
}
.buttons{
  margin: 10px 0;
}
.student-list{
  margin: 10px 0;
}
.pagination-block{
  margin: 10px 0;
  text-align: center;
}
</style>