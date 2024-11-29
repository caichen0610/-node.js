<template>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" :inline="true" style="max-width: 800px">
        <el-form-item label="职位名称">
            <el-input v-model="queryParams.job_name" placeholder="请输入职位名称" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="queryParams.address" placeholder="请输入企业地址" style="width: 150px;" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="openDialog(null)">发布</el-button>
        </el-form-item>
    </el-form>

    <!-- 表格显示数据 -->
    <el-table :data="formList" style="width: 100%">
        <el-table-column prop="job_id" label="ID" width="50" />
        <el-table-column prop="job_name" label="岗位名" width="200" />
        <el-table-column prop="company_name" label="企业名称" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="salary" label="待遇" />
        <el-table-column prop="job_description" label="工作描述" />
        <el-table-column prop="requirements" label="要求" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button @click="openDialog(scope.row.job_id)" type="primary" plain>修改</el-button>
                <el-button @click="del(scope.row.job_id)" type="danger" plain>删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 编辑/新增对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
        <el-form :model="formData" ref="formRef">
            <el-form-item label="职位名称">
                <el-input v-model="formData.job_name" placeholder="请输入职位名称" />
            </el-form-item>
            <el-form-item label="企业名称">
                <el-input v-model="formData.company_name" placeholder="请输入企业名称" />
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="formData.address" placeholder="请输入企业地址" />
            </el-form-item>
            <el-form-item label="待遇">
                <el-input v-model="formData.salary" placeholder="请输入待遇" />
            </el-form-item>
            <el-form-item label="工作描述">
                <el-input v-model="formData.job_description" placeholder="请输入工作描述" />
            </el-form-item>
            <el-form-item label="要求">
                <el-input v-model="formData.requirements" placeholder="请输入要求" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveJob">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getList, getJobDetail, updateJob, addJob, softDeleteJob } from '../api/jobPosition';

const formList = ref([]); // 表格数据
const queryParams = ref({
    job_name: '',
    address: ''
});

const dialogVisible = ref(false); // 控制对话框显示
const formData = ref({
    job_name: '',
    company_name: '',
    address: '',
    salary: '',
    job_description: '',
    requirements: ''
}); // 表单数据
const dialogTitle = ref(''); // 对话框标题

onMounted(() => {
    handleQuery();
});

const handleQuery = () => {
    getList(queryParams.value)
        .then(res => {
            formList.value = res.data;
        })
        .catch(err => {
            console.error('获取数据失败:', err);
        });
};

const handleReset = () => {
    queryParams.value.job_name = '';
    queryParams.value.address = '';
    handleQuery();
};

const del = (jobId) => {
    softDeleteJob({ job_id: jobId })
        .then(() => {
            handleQuery();
        })
        .catch(err => {
            console.error('删除失败:', err);
        });
};

const openDialog = (jobId) => {
    if (jobId || jobId === 0) {
        dialogTitle.value = '编辑职位'; // 动态标题
        getJobDetail(jobId).then(res => {
            formData.value = res; // 填充表单数据
            dialogVisible.value = true; // 显示对话框
        }).catch(err => {
            console.error('获取职位详情失败:', err);
        });
    } else {
        dialogTitle.value = '发布职位'; // 动态标题
        formData.value = {
            job_name: '',
            company_name: '',
            address: '',
            salary: '',
            job_description: '',
            requirements: '',
            job_id: null
        };
        dialogVisible.value = true; // 显示对话框
    }
};



const saveJob = () => {
    const apiCall = formData.value.job_id ? updateJob : addJob;
    const params = formData.value;

    apiCall(params).then(() => {
        dialogVisible.value = false;
        handleQuery();
    }).catch(err => {
        console.error('保存职位失败:', err);
    });
};
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>
