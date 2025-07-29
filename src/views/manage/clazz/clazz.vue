<script setup>
// 引入Vue的ref和onMounted
import {ref,onMounted,watch} from "vue";
import {Check, Close, DeleteFilled, Loading, MoreFilled, Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

// 引入请求方法
import {getClazzListByCondition,insertClazzInfo,getClazzById, updateClazzByCondition,deleteClazzById} from "@/api/clazz";
import {getAllEmployees} from "@/api/employee";
import {getAllSubjects} from "@/api/subject";


// 条件分页查询部分：
// 定义核心的查询方法
const getClazzList = async () => {
  const results = await getClazzListByCondition(searchForm.value.name,searchForm.value.beginDate,searchForm.value.endDate,currentPage.value,pageSize.value);
  if (results.code === 1){
    clazzList.value = results.data.records; // 绑定查询结果到clazzList
    total.value = results.data.total; // 绑定总条数到total
  }else{
    ElMessage.error(results.message || 'Failed to fetch class list');
  }
};
// 在组件挂载时调用查询方法
onMounted(() => {
  getClazzList();
});

// 定义响应的变量，用于绑定查询表单
const searchForm = ref({
  name: '',
  dateRange: [],
  beginDate: '',
  endDate: ''
});
// 定义watch方法，侦听searchForm.dateRange的变化，并且赋值给beginDate和endDate
watch( () => searchForm.value.dateRange,(newValue) => {
  if (newValue && newValue.length === 2){
    searchForm.value.beginDate = newValue[0];
    searchForm.value.endDate = newValue[1];
  }
},{immediate:true} );


// 定义查询方法
const search = () => {
  getClazzList();
};
// 定义重置查询表单的方法
const resetSearchForm = () => {
  searchForm.value = {
    name: '',
    dateRange: [],
    beginDate: '',
    endDate: ''
  }
  // 重置查询结果
  getClazzList();
};

// 定义表格绑定的数据
const clazzList = ref([]);

// 定义分页相关的变量
const currentPage = ref(1); // 默认当前页为1
const pageSize = ref(10); // 默认每页显示10条数据
const total = ref(0); // 总条数,等待后端返回
const background = ref(true); // 分页组件的背景色，默认为true
// 定义页码变化和每页条数变化的处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  getClazzList(); // 每次改变页码或每页条数时重新查询
};
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  getClazzList(); // 每次改变页码或每页条数时重新查询
};




// 新增班级部分：
// 定义dialog的属性，dialog与编辑共用
const dialogTitle = ref('');
const dialogVisible = ref(false); // 控制dialog的显示与隐藏

// 定义dialog中表单的绑定对象
const clazzForm = ref({
  name: '',
  room: '',
  dateRange: [],
  beginDate: '',
  endDate: '',
  masterId: '',
  subjectId: ''
});
// 定义watch方法，侦听clazzForm.dateRange的变化，并且赋值给beginDate和endDate
watch( () => clazzForm.value.dateRange, (newValue) => {
  if (clazzForm.value.dateRange.length === 2){
    clazzForm.value.beginDate = newValue[0];
    clazzForm.value.endDate = newValue[1];
  }
}, {immediate:true}
);
// 定义表单对象本身
const elFormRef = ref(null);
// 定义表单验证规则
const rules = {
  name: [
    { required: true, message: 'Please enter class name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be between 2 and 20 characters', trigger: 'blur' }
  ],
  room: [
    {required: false, message: 'Please enter class room', trigger: 'blur'},
    {min: 2, max: 20, message: 'Length should be between 2 and 20 characters', trigger: 'blur'}
  ],
  dateRange: [
    { type: 'array', required: true, message: 'Please select date range', trigger: 'change' }
  ],
  subjectId: [
    { required: true, message: 'Please select subject', trigger: 'change' }
  ]
};

// 定义表单中的master与subject的选项
// 以下两个方法在dialog被打开时调用，获取职位和部门列表，填充dialog中的下拉列表
const masterList = ref([]); // 存储所有员工
const subjectList = ref([]); // 存储所有科目
// 定义获取所有员工和科目的方法
const getMasterList = async () => {
  const results = await getAllEmployees();
  if (results.code === 1) {
    masterList.value = results.data; // 绑定所有员工到masterList
  } else {
    ElMessage.error(results.message || 'Failed to fetch employee list');
  }
};
const getSubjectList = async () => {
  const results = await getAllSubjects();
  if (results.code === 1) {
    subjectList.value = results.data; // 绑定所有科目到subjectList
  } else {
    ElMessage.error(results.message || 'Failed to fetch subject list');
  }
};

// 定义打开dialog的函数
const openCreateDialog = async () => {
  dialogTitle.value = 'Create clazz';
  // 清空表单数据
  clazzForm.value = {
    name: '',
    room: '',
    dateRange: [],
    beginDate: '',
    endDate: '',
    masterId: '',
    subjectId: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 获取所有员工和科目列表，用于下拉选项
  await getMasterList();
  await getSubjectList();
  // 显示dialog
  dialogVisible.value = true;
};

// 定义表单的确认和取消方法
// 流程：1.表单验证，2.发起请求，3.获取结果并进行判断，4.如果成功，则显示消息、清空表单项和验证、关闭dialog、刷新显示，5.失败则显示错误消息
const confirm = () => {
  // 首先进行表单的验证
  elFormRef.value.validate( async (valid) => {
    if (!valid){ // 如果验证不通过，则提示消息
      ElMessage.error('Please enter valid subject');
      return;
    }
    // 如果验证通过，则发起请求
    // 增加一层逻辑判断，判断属于新增操作还是编辑操作
    let result;
    if (dialogTitle .value === 'Create clazz'){
      result = await insertClazzInfo(clazzForm.value);
    }else{
      result = await updateClazzByCondition(clazzForm.value);
    }
    // 获取结果并进行判断
    if (result.code === 1){
      ElMessage({
        type: 'success',
        message: dialogTitle.value === 'Create clazz' ? 'Class created successfully' : 'Class updated successfully'
      });
      // 清空表单数据
      clazzForm.value = {
        name: '',
        room: '',
        dateRange: [],
        beginDate: '',
        endDate: '',
        masterId: '',
        subjectId: ''
      };
      // 将验证规则重置,
      if(elFormRef.value){  // 确保此时DOM已经完全渲染
        elFormRef.value.clearValidate();
      }
      // 关闭dialog
      dialogVisible.value = false;
      // 刷新表格数据
      await getClazzList();
    }else{
      ElMessage({
        type: 'error',
        message: dialogTitle.value === 'Create clazz' ? 'Failed to create class' : 'Failed to update class'
      })
    }
  });
};
const cancel = () => {
  // 清空表单数据
  clazzForm.value = {
    name: '',
    room: '',
    dateRange: [],
    beginDate: '',
    endDate: '',
    masterId: '',
    subjectId: ''
  };
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  dialogVisible.value = false;
};





// 编辑班级信息部分
// 定义打开编辑dialog的函数，与打开新增dialog共用
const openEditDialog = async (id) => {
  // 首先修改dialog标题
  dialogTitle.value = 'Edit clazz';
  // 将验证规则重置,
  if(elFormRef.value){  // 确保此时DOM已经完全渲染
    elFormRef.value.clearValidate();
  }
  // 获取所有员工和科目列表，用于下拉选项
  await getMasterList();
  await getSubjectList();
  // 获取班级信息
  const result = await getClazzById(id);
  if (result.code === 1){
    // 绑定班级信息到clazzForm
    clazzForm.value = result.data;
    // 注意：此时后端传递回的对象中，员工历史工作数组中的对象没有dateRange属性，所以不会显示在表单中
    // 所以，我们需要单独处理，将数组中的每一个对象中的dateRange赋值
    clazzForm.value.dateRange = [clazzForm.value.beginDate,clazzForm.value.endDate]
    // 显示dialog
    dialogVisible.value = true;
  }else{
    ElMessage.error(result.message || 'Failed to fetch class info');
  }
};
// 定义编辑表单的确认方法与取消方法
// 与新增班级的confirm和cancel方法共用






// 删除班级部分：
const deleteDialogTitle = ref(''); // 定义删除dialog的标题
const deleteDialogVisible = ref(false); // 控制删除dialog的显示与隐藏
// 定义需要删除的班级ID
const clazzIdToBeDeleted = ref([]);

// 单个删除
// 定义打开删除dialog的函数
const openSingleDeleteDialog = (id) => {
  // 首先修改dialog标题
  deleteDialogTitle.value = 'Delete Class';
  // 将需要删除的班级ID赋值给clazzIdToBeDeleted
  clazzIdToBeDeleted.value = [id];
  // 显示dialog
  deleteDialogVisible.value = true;
}

// 批量删除
// 定义表格中复选框的变化处理函数
// 在el-table中，使用@selection-change事件来监听选中项的变化，用户每次点击复选框时都会触发这个事件
// 在这个事件处理函数中，我们可以获取到当前选中的行数据-selection，
// selection是一个数组，数组中的元素为当前选中的行的数据对象，而数据对象中包含了所有通过api获取到的员工信息的所有字段
const handleSelectionChange = (selection) => {
  // 将selection中的每一个元素的每一个id属性提取出来，并且存储到employeeToBeDeleted数组中
  // 注意：这里不能使用遍历每个元素的方式获取id，因为：
  //      用户每次点击复选框都会触发这个时间，如果每次都进行遍历获取id，则employeeToBeDeleted数组中每次都会重复添加上一次存在的id
  // 所以：在每次点击复选框时，应该首先清空employeeToBeDeleted数组，然后再将所有选中的行数据的id添加到数组中
  clazzIdToBeDeleted.value = selection.map(item => item.id);
}
// 定义打开批量删除dialog的函数
const openBatchDeleteDialog = () => {
  // 首先修改dialog标题
  deleteDialogTitle.value = 'Batch Delete Class';
  // 检查是否有选中的行，如果没有，则提示用户，并且不打开对话框
  if (clazzIdToBeDeleted.value.length === 0){
    ElMessage.warning('Please select at least one class to delete');
    return;
  }
  // 显示dialog
  deleteDialogVisible.value = true;
};

// 定义删除的确认方法
const confirmDelete = async () => {
  const result = await deleteClazzById(clazzIdToBeDeleted.value);
  if (result.code === 1){
    ElMessage({
      type: 'success',
      message: deleteDialogTitle.value === 'Delete Class' ? 'Class deleted successfully' : 'Classes deleted successfully'
    });
    // 清空需要删除的班级ID
    clazzIdToBeDeleted.value = [];
    // 关闭删除dialog
    deleteDialogVisible.value = false;
    // 刷新表格数据
    await getClazzList();
  }else{
    ElMessage.error(result.message || 'Failed to delete class');
  }

};
// 定义删除的取消方法
const cancelDelete = () => {
  // 清空需要删除的班级ID
  clazzIdToBeDeleted.value = [];
  // 关闭删除dialog
  deleteDialogVisible.value = false;
}

</script>

<template>
  <div class="clazz-container">
    <h2>📚 Class Management</h2>

    <!-- 条件搜索框 -->
    <div class="search-form">
      <el-form :model="searchForm" class="search-form" inline>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Class Name" prop="name">
              <el-input v-model="searchForm.name" placeholder="Please enter name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Begin Date" prop="dateRange">
              <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="To"
                  start-placeholder="Begin date"
                  end-placeholder="End date"
                  style="width: 220px"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search"><el-icon><Search /></el-icon>&nbsp;Search</el-button>
                <el-button type="info" @click="resetSearchForm"><el-icon><Loading /></el-icon>&nbsp;Reset</el-button>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 新增班级 & 批量删除按钮 -->
    <div class="buttons">
      <el-button type="primary" @click="openCreateDialog">+ Create New Employee</el-button>
      <el-button type="primary" @click="openBatchDeleteDialog">- Delete Employees</el-button>
    </div>
    <!-- 主表格，显示员工列表 -->
    <div class="clazz-list">
      <el-table :data="clazzList" @selection-change="handleSelectionChange" stripe width="100%" center>
        <el-table-column type="selection"  width="55px" align="center"/>
        <el-table-column prop="name" label="Class Name" width="280px" align="center"/>
        <el-table-column prop="room" label="Class Room" width="130px" align="center"/>
        <el-table-column prop="masterName" label="Master Name" width="150px" align="center"/>
        <el-table-column prop="beginDate" label="Begin Date" width="100px" align="center"/>
        <el-table-column prop="endDate" label="End Date" width="100px" align="center"/>
        <el-table-column prop="status" label="Status" width="100px" align="center"/>
        <el-table-column prop="updateTime" label="Update Time" width="180px" align="center"/>
        <el-table-column label="Action" width="220px" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="openEditDialog(scope.row.id)" ><el-icon><MoreFilled /></el-icon>&nbsp;Edit</el-button>
            <el-button type="danger" size="small" @click="openSingleDeleteDialog(scope.row.id)"><el-icon><DeleteFilled /></el-icon>&nbsp;Delete</el-button>
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

    <!-- 新增或编辑班级的对话框 -->
    <div class="dialog-container">
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" center>
        <el-form :model="clazzForm" ref="elFormRef" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Class Name" prop="name">
                <el-input v-model="clazzForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Class Room" prop="room">
                <el-input v-model="clazzForm.room"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Master Name" prop="masterId">
                <el-select v-model="clazzForm.masterId">
                  <el-option
                      v-for="master in masterList" :key="master.id"
                      :label="master.name"
                      :value="master.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="Subject Name" prop="subjectId">
                <el-select v-model="clazzForm.subjectId">
                  <el-option
                      v-for="subject in subjectList" :key="subject.id"
                      :label="subject.name"
                      :value="subject.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Duration" prop="dateRange">
                <el-date-picker
                    v-model="clazzForm.dateRange"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Begin date"
                    end-placeholder="End date"
                    style="width: 220px"
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
          Are you sure you want to delete this class? This action cannot be undone.
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
.clazz-container .clazz-list{
  margin: 10px 0;
}
.pagination-block{
  padding: 10px 0;
}
</style>