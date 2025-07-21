<script setup>
  // Import necessary components from Element Plus
  import { ref,onMounted } from 'vue';
  import {Check, Close, DeleteFilled, MoreFilled} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  // Import Element Plus components
  const departmentList = ref([]); // This will hold the department data

  // import functions from the API service
  import { listAllDepartments,createDepartment,getDepartmentById ,updateDepartmentById,deleteDepartmentById} from '../../../api/department.js';

  // 获取全部部门列表部分
  const showAllDepartments = async () => {
    const results = await listAllDepartments();
    if (results.code === 1) {
      departmentList.value = results.data; // Update the department list with the fetched data
    } else {
      console.error('Failed to fetch departments:', results.message); // Log an error if fetching fails
    }
  };
  // Define the onMounted lifecycle hook to fetch data when the component is mounted
  onMounted( () => {
  showAllDepartments(); // Call the function to fetch and display all departments}
  });


  // 新增部门部分
  // 由于需要复用dialog框（新增与编辑），所以dialog的title的内容需要动态调整
  const dialogTitle = ref('');
  // Define a reactive variable for the dialog visibility
  const dialogFormVisible = ref(false); // Controls the visibility of the dialog

  // 定义新增部门的表单数据
  const departmentForm = ref({
    id: null, // 初始值为null，新增&回显时不需要id,修改时需要传入id
    name: ''
  });
  // 定义整个el-form的ref对象，用于接收整个el-form，作为对象调用el-form中的validate()验证方法
  const elFormRef = ref();
  // 定义rules
  const rules = {
    name: [ // rule的名称为name，需要与表单数据中的字段对应
      {required: true, message: 'Please enter the department name', trigger: 'blur'},
      {min: 2, max: 20, message: 'Department name must be between 2 and 20 characters', trigger: 'blur'}
    ]
    // 这里可以添加更多的验证规则
  };
  // 定义点击新增按钮时的函数
  const openCreateDialog = () => {
    // 将对话框标题设置为“新增部门”
    dialogTitle.value = 'Create New Department';
    // 将表单数据清空
    departmentForm.value = {
      id: null,
      name: ''
    };
    // 将验证规则重置,
    if(elFormRef.value){  // 确保此时DOM已经完全渲染
      elFormRef.value.clearValidate();
    }
    // 打开对话框
    dialogFormVisible.value = true;
  }
  // 定义对话框中确认新增按钮的函数
  const confirm = () => {
    if (!elFormRef.value){
      return; // 如果elFormRef未定义，则直接返回
    }
    // 提交之前先验证表单，调用整个表单对象的validate方法,从而触发rules规则的验证
    elFormRef.value.validate( async(valid) => {
      if (!valid){ // 如果验证不通过
        ElMessage.error('Please correct the errors in the form before submitting.');
        return;
      }
      // 如果验证通过，执行后续操作
      // 补充添加逻辑判断，如果是新增操作，则使用新增逻辑，如果是编辑操作，则使用编辑逻辑
      if(dialogTitle.value === 'Create New Department'){ // 如果是新增操作
        // 首先调用api中的新增部门函数
        const result = await createDepartment(departmentForm.value);
        // 判断是否新增成功
        // 如果成功，则:1.显示成功的消息,2.关闭对话框，4.刷新部门列表显示
        if(result.code === 1){
          ElMessage({
            message: 'Department created successfully!',
            type: 'success'
          });
          dialogFormVisible.value = false;
          await showAllDepartments();
        }else{ // 如果失败，则显示错误信息
          ElMessage.error('Department creation failed: ' + result.message);
        }
      }else if (dialogTitle.value === 'Edit Department'){ // 如果是编辑操作
        // 首先调用api中的编辑部门函数
        const result = await updateDepartmentById(departmentForm.value);
        // 判断是否成功
        // 如果成功，则： 1.显示消息，2.关闭dialog，3.刷新部门列表显示
        if(result.code === 1){
          ElMessage({
            message: 'Department updated successfully!',
            type: 'success'
          });
          dialogFormVisible.value = false;
          await showAllDepartments();
        }else(
            ElMessage.error('Department update failed: ' + result.message)
        );
      }

    });
  };


  // 修改部门部分
  // 定义点击Edit按钮的方法(包含了回显操作)
  const openEditDialog = async (id) => {
    dialogTitle.value = 'Edit Department';
    // 调用department.js中的获取部门详情的函数，传入当前行的id（通过scope.row.id获取）
    const result = await getDepartmentById(id)
    // 将获取到的部门数据填充到表单中
    departmentForm.value = result.data;
    // 将验证规则重置,
    if(elFormRef.value){  // 确保此时DOM已经完全渲染
      elFormRef.value.clearValidate();
    }
    dialogFormVisible.value= true; // Open the dialog for editing
  }
  // 定义确认编辑按钮的函数
  // 共用confirmCreate函数


  // 删除部门部分
  // 采用单独的dialog来显示确认删除的提示
  const deleteDialogVisible = ref(false); // 控制删除对话框的显示
  const deleteId = ref(null); // 用于存储要删除的部门ID
  // 定义点击删除按钮的函数,流程：1.打开删除确认对话框，2. 将要删除的部门ID存储到deleteId中，以供后续确认按钮使用
  const openDeleteDialog = (id) => {
    deleteDialogVisible.value = true; // Open the delete confirmation dialog
    deleteId.value = id; // Store the ID of the department to be deleted
  }
  // 定义删除确认按钮的函数,流程：1. 调用api中的删除部门函数，传入deleteId，2. 判断是否删除成功，3. 显示消息，4. 关闭对话框，5. 刷新部门列表显示
  const deleteConfirm = async () => {
    const result = await deleteDepartmentById(deleteId.value);
    if (result.code === 1){
      ElMessage({
        message: 'Department deleted successfully!',
        type: 'success'
      });
      deleteDialogVisible.value = false; // Close the delete confirmation dialog
      await showAllDepartments(); // Refresh the department list
    } else {
      ElMessage.error('Department deletion failed: ' + result.message);
    }
  }



</script>

<template>
  <div class="department-container">
    <h2>🏢 Department Management</h2>
    <div id="create-button" class="department-container">
      <el-button type="primary" @click="openCreateDialog">+ Create New Department</el-button>
    </div>
    <div id="department-table" class="department-container">
      <el-table :data="departmentList" stripe width="90%">
        <el-table-column prop="id" label="Id" align="center"></el-table-column>
        <el-table-column prop="name" label="Name" align="center"></el-table-column>
        <el-table-column prop="createTime" label="Create Time" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="Update Time" align="center"></el-table-column>
        <el-table-column label="Actions" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="openEditDialog(scope.row.id)"><el-icon><MoreFilled /></el-icon>&nbsp;Edit</el-button>
            <el-button type="danger" size="small" @click="openDeleteDialog(scope.row.id)"><el-icon><DeleteFilled /></el-icon>&nbsp;Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="department-container" id="department-dialog">
      <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="30%" center>
        <el-form :model="departmentForm" ref="elFormRef" :rules="rules" >
          <el-form-item label="Name of Department:" prop="name">
            <el-input v-model="departmentForm.name" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="confirm"><el-icon><Check /></el-icon>&nbsp;Confirm</el-button>
            <el-button @click="dialogFormVisible = false"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="deleteDialogVisible" title="Delete Department" width="30%" center>
        <span>
          Are you sure you want to delete this department? This action cannot be undone.
        </span>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="danger" @click="deleteConfirm"><el-icon><delete-filled /></el-icon>&nbsp;Delete</el-button>
            <el-button @click="deleteDialogVisible = false"><el-icon><Close /></el-icon>&nbsp;Cancel</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<style scoped>
.department-container {
  margin: 10px 0;
}


</style>