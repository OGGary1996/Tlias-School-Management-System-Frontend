<script setup>
// 引入Vue的响应式API
import {Check, Close, DeleteFilled, MoreFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {ref, onMounted} from 'vue';

// 引入api的方法
import {getAllSubjects,createSubject, getSubjectById, updateSubject,deleteSubject} from "@/api/subject.js";


// 显示所有科目列表部分：
// 定义响应式对象，存储科目列表
const subjectList = ref([]);
// 核心方法，用于获取所有科目数据
const getSubjectList = async () => {
  const results = await getAllSubjects();
  if (results.code === 1){
    subjectList.value = results.data;
  }else{
    ElMessage({
      type: "error",
      message: 'Failed to fetch subjects: ' + results.message
    });
  }
};
// 定义钩子函数，在组件挂载时调用获取科目数据的函数
onMounted( () => {
  getSubjectList(); // 调用函数以获取并显示所有科目
});




// 新增科目部分：
// 定义响应式对象，用于控制对话框的显示与标题
const dialogTitle = ref('');
const dialogFormVisible = ref(false); // 控制对话框的显示
// 定义响应式数据，作为表单数据
const subjectForm = ref({
  name: '',
  description: ''
});
// 定义表单对象的引用
const elFormRef = ref();
// 定义验证规则
const rules = {
  name:[
    { required: true, message: 'Please enter the subject name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Subject name must be between 2 and 20 characters', trigger: 'blur' }
  ],
  description:[
    { required: true, message: 'Please enter the subject description', trigger: 'blur' },
    { min: 2, max: 255, message: 'Subject description must be between 2 and 100 characters', trigger: 'blur' }
  ]
};

// 定义打开创建对话框的函数
const openCreateDialog = () => {
  // 首先设置对话框标题
  dialogTitle.value = 'Create Subject';
  // 清空表单数据与验证状态
  subjectForm.value ={
    name: '',
    description: ''
  };
  if (elFormRef.value) {
    elFormRef.value.clearValidate(); // 清除验证状态
  }
  // 显示对话框
  dialogFormVisible.value = true;
};
// 定义确认提交的函数与取消提交的函数
const confirm = () => {
  // 首先进行验证
  elFormRef.value.validate( async (valid) => {
    if (!valid){ // 验证不通过
      ElMessage({
        type: "error",
        message: 'Please correct the errors in the form before submitting.'
      });
      return;
    }
    // 验证通过后，调用API进行创建科目
    // 添加逻辑判断，判断是进行新增还是编辑操作
    let result;
    if (dialogTitle.value === 'Create Subject'){
      result = await createSubject(subjectForm.value);
    }else{
      result = await updateSubject(subjectForm.value);
    }
    if (result.code === 1){
      ElMessage({
        type: "success",
        message: dialogTitle.value === 'Create Subject' ? 'Subject created successfully!' : 'Subject updated successfully!'
      });
      // 清空表单数据与验证状态
      subjectForm.value ={
        name: '',
        description: ''
      };
      if (elFormRef.value) {
        elFormRef.value.clearValidate(); // 清除验证状态
      }
      dialogFormVisible.value = false; // 关闭对话框
      await getSubjectList(); // 刷新科目列表
    } else {
      ElMessage({
        type: "error",
        message: dialogTitle.value === 'Create Subject' ? 'Failed to create subject: ' + result.message : 'Failed to update subject: ' + result.message
      });
    }
  })
};
const cancel = () => {
  // 清空表单数据与验证状态
  subjectForm.value ={
    name: '',
    description: ''
  };
  if (elFormRef.value) {
    elFormRef.value.clearValidate(); // 清除验证状态
  }
  dialogFormVisible.value = false; // 关闭对话框
};




// 更新科目部分：
// 与新增科目共用Dialog
// 定义打开编辑对话框的函数
const openEditDialog = async (id) => {
  // 首先设置对话框标题
  dialogTitle.value = 'Edit Subject';
  // 清空表单数据与验证状态
  subjectForm.value ={
    name: '',
    description: ''
  };
  if (elFormRef.value) {
    elFormRef.value.clearValidate(); // 清除验证状态
  }
  // 调用API获取科目信息
  const result = await getSubjectById(id);
  if (result.code === 1){
    subjectForm.value = result.data;
    dialogFormVisible.value = true; // 显示对话框
  }else{
    ElMessage({
      type: "error",
      message: 'Failed to fetch subject details: ' + result.message
    });
  }
};
// 定义确认提交的函数与取消提交的函数
// 与新增科目共用




// 删除科目部分：
// 定义响应式变量，用于控制删除对话框的显示
const deleteDialogVisible = ref(false); // 控制删除对话框的显示
// 定义响应式变量，用于存储要删除的科目id
const subjectToBeDeleted = ref(null); // 用于存储要删除的科目id
// 定义打开删除对话框的函数
const openDeleteDialog = (id) => {
  subjectToBeDeleted.value = id;
  deleteDialogVisible.value = true; // 打开删除对话框
}
// 定义确认删除按钮的函数
const confirmDelete = async () => {
  const result = await deleteSubject(subjectToBeDeleted.value);
  if (result.code === 1){
    ElMessage({
      type: "success",
      message: 'Subject deleted successfully!'
    });
    subjectToBeDeleted.value = null; // 清空要删除的科目id
    deleteDialogVisible.value = false; // 关闭删除对话框
    await getSubjectList(); // 刷新科目列表
  } else {
    ElMessage({
      type: "error",
      message: 'Failed to delete subject: ' + result.message
    });
  }
}


</script>

<template>
  <div class="subject-container">
    <h2>🧑‍💻 Subject Management</h2>
    <div class="create-button">
      <el-button type="primary" @click="openCreateDialog">+ Create New Department</el-button>
    </div>
    <div class="subject-list">
      <el-table :data="subjectList" stripe width="90%">
        <el-table-column prop="id" label="Id" align="center" width="100px"></el-table-column>
        <el-table-column prop="name" label="Name" align="center"></el-table-column>
        <el-table-column prop="description" label="Description" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="Create Time" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="Update Time" align="center"></el-table-column>
        <el-table-column label="Actions" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="openEditDialog(scope.row.id)" ><el-icon><MoreFilled /></el-icon>&nbsp;Edit</el-button>
            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row.id)"><el-icon><DeleteFilled /></el-icon>&nbsp;Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增科目与编辑科目的Dialog -->
    <div class="create/edit-dialog">
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible" width="50%" center>
        <el-form :model="subjectForm" ref="elFormRef" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Name of Subject:" prop="name">
                <el-input v-model="subjectForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="Description:" prop="description">
                <el-input v-model="subjectForm.description"/>
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
    <div class="delete-dialog">
      <el-dialog title="Delete Position" v-model="deleteDialogVisible" width="30%" center>
        <span>
          Are you sure you want to delete this subject? This action cannot be undone.
        </span>
        <template #footer>
          <el-button type="danger" @click="confirmDelete"><el-icon><delete-filled /></el-icon>&nbsp;Delete</el-button>
          <el-button @click="deleteDialogVisible = false"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>
    </div>


  </div>
</template>

<style scoped>
.subject-container .subject-list{
  margin: 10px 0;
}

</style>