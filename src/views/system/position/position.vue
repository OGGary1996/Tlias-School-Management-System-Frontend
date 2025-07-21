<script setup>
// 引入Vue的响应式API
import { ref, onMounted } from 'vue';
import {Check, Close, DeleteFilled, MoreFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
// 引入api的方法
import {listAllPositions,createPosition,getPositionById, updatePositionById,deletePositionById} from "@/api/position.js";


// 列表查询部分：
// 定义响应式对象，存储职位列表
const positionList = ref([]);
// 定义一个函数来获取所有职位数据
const showAllPositions = async () => {
  const results = await listAllPositions();
  if (results.code === 1){
    positionList.value= results.data; // 更新职位列表
  }else{
    console.error('Failed to fetch positions:', results.message); // 如果获取失败，打印错误信息
  }
};
// 定义钩子函数，在组件挂载时调用获取职位数据的函数
onMounted( () => {
  showAllPositions(); // 调用函数以获取并显示所有职位
})


// 新增职位部分：
// 定义响应式变量，用于控制对话框的显示与标题
const dialogTitle = ref('');
const dialogFormVisible = ref(false); // 控制对话框的显示
// 定义响应式数据，作为表单数据
const positionForm = ref({
  id: null, // 初始值为null，新增&回显时不需要id,修改时需要传入id
  name: '',
  description: ''
})

// 定义打开创建对话框的函数
const openCreateDialog = () => {
  dialogTitle.value = 'Create New Position'; // 设置对话框标题
  positionForm.value = { // 清空表单数据
    id: null,
    name: '',
    description: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  dialogFormVisible.value = true; // 显示对话框
}

// 定义rules,和el-form的ref对象
const elFormRef = ref();
const rules = {
  name: [ // rule的名称为name，需要与表单数据中的字段对应
    { required: true, message: 'Please enter the position name', trigger: 'blur' },
    { min: 2, max: 20, message: 'Position name must be between 2 and 20 characters', trigger: 'blur' }
  ],
  description: [
    { required: false, message: 'Please enter the position description', trigger: 'blur' },
    { min: 2, max: 255, message: 'Description must be between 5 and 100 characters', trigger: 'blur' }
  ]
}

// 定义提交表单的函数
const confirm = () => {
  if (!elFormRef.value) {
    return; // 如果elFormRef未定义，则直接返回
  }
  // 提交之前先验证表单，调用整个表单对象的validate方法,从而触发rules规则的验证
  elFormRef.value.validate( async (valid) => {
    if (!valid) { // 如果验证不通过
      ElMessage.error('Please correct the errors in the form before submitting.');
      return; // 终止async函数的执行
    }
    // 补充逻辑判断，判断是进行新增还是编辑操作
    if(dialogTitle.value === 'Create New Position'){ // 如果是新增操作
      // 如果通过,发送请求创建职位
      const result = await createPosition(positionForm.value);
      if(result.code === 1){ // 如果请求成功，则：1.显示消息，2.关闭dialog，3.刷新页面显示
        ElMessage({
          message: 'Position created successfully!',
          type: 'success'
        });
        dialogFormVisible.value = false; // 关闭对话框
        await showAllPositions(); // 刷新职位列表
      }else{ // 如果请求失败，则显示错误信息
        ElMessage.error('Position creation failed: ' + result.message);
      }
    }else{ // 如果是编辑操作
      const result = await updatePositionById(positionForm.value);
      if (result.code === 1){ // 如果请求成功，则：1.显示消息，2.关闭dialog，3.刷新页面显示
        ElMessage({
          message: 'Position updated successfully!',
          type: 'success'
        });
        dialogFormVisible.value = false; // 关闭对话框
        await showAllPositions(); // 刷新职位列表
      }else{
        ElMessage.error('Position update failed: ' + result.message); // 如果请求失败，则显示错误信息
      }
    }
  });
}



// 编辑职位部分：
// 定义打开编辑对话框的函数
// 流程：1.修改Title，2.发起请求获取职位信息并保存到对象中，3.清空验证规则，4.打开对话框
const openEditDialog = async (id) => {
  dialogTitle.value = 'Edit Position'; // 设置对话框标题
  const result = await getPositionById(id);
  positionForm.value = result.data; // 将获取到的职位信息保存到表单数据中
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  dialogFormVisible.value = true; // 打开对话框
};
// 确认提交按钮复用confirm按钮



// 删除职位部分：
// 定义响应式变量，用于控制删除对话框的显示
const deleteDialogVisible = ref(false); // 控制删除对话框的显示
// 定义响应式变量，用于存储要删除的职位id
const positionToBeDeleted = ref(null); // 用于存储要删除的职位id

// 定义打开删除对话框的函数
const openDeleteDialog = (id) => {
  // 将id存储到变量
  positionToBeDeleted.value = id; // 存储要删除的职位id
  deleteDialogVisible.value = true; // 打开删除对话框
}
// 定义确认删除按钮的函数
const confirmDelete = async () => {
  const result = await deletePositionById(positionToBeDeleted.value);
  if (result.code === 1) { // 如果删除成功
    ElMessage({
      message: 'Position deleted successfully!',
      type: 'success'
    });
    deleteDialogVisible.value = false; // 关闭删除对话框
    await showAllPositions(); // 刷新职位列表
  } else { // 如果删除失败
    ElMessage.error('Position deletion failed: ' + result.message);
  }
}


</script>

<template>
  <div class="position-container">
    <h2>💼 Position Management</h2>
    <div id="create-button" class="position-container">
      <el-button type="primary" @click="openCreateDialog">+ Create New Position</el-button>
    </div>
    <div id="position-table" class="position-container">
      <el-table :data="positionList" stripe width="90%" center>
        <el-table-column prop="id" label="Id" align="center"></el-table-column>
        <el-table-column prop="name" label="Position Name" align="center"></el-table-column>
        <el-table-column prop="description" label="Description" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="createTime" label="Create Time" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="Update Time" align="center"></el-table-column>
        <el-table-column label="Action" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="openEditDialog(scope.row.id)" ><el-icon><MoreFilled /></el-icon>&nbsp;Edit</el-button>
            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row.id)"><el-icon><DeleteFilled /></el-icon>&nbsp;Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="department-container" id="department-dialog">
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible" width="30%" center>
        <el-form :model="positionForm" ref="elFormRef" :rules="rules">
          <el-form-item label="Name of Position:" prop="name">
            <el-input v-model="positionForm.name"/>
          </el-form-item>
          <el-form-item label="Description of Position:" prop="description">
            <el-input v-model="positionForm.description"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="confirm"><el-icon><Check /></el-icon>&nbsp;Confirm</el-button>
          <el-button @click="dialogFormVisible = false"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
        </template>
      </el-dialog>

      <el-dialog title="Delete Position" v-model="deleteDialogVisible" width="30%" center>
        <span>
          Are you sure you want to delete this position? This action cannot be undone.
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
.position-container {
  margin: 10px 0;
}
</style>