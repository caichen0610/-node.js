<template>
    <div>
        <!-- 搜索表单 -->
        <el-form :model="queryParams" :inline="true" style="max-width: 800px">
            <el-form-item label="职位名称">
                <el-input v-model="queryParams.job_name" placeholder="请输入职位名称" style="width: 150px;" />
            </el-form-item>
            <el-form-item label="学校">
                <el-input v-model="queryParams.university" placeholder="请输入学校" style="width: 150px;" />
            </el-form-item>
            <el-form-item>
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <!-- 重置按钮 -->
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 求职者信息表格 -->
        <el-table :data="userList" style="width: 100%">
            <el-table-column prop="job_name" label="职位名" width="200" />
            <el-table-column prop="username" label="求职者名" width="150" />
            <el-table-column prop="phone_number" label="电话" width="150" />
            <el-table-column prop="university" label="学校" width="200" />
            <el-table-column prop="gender" label="性别" width="100" />
            <el-table-column prop="bio" label="个人简介" width="300" />
            <el-table-column prop="job_position" label="意向岗位" width="350" />
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserList } from '../api/resume';

// 表格数据
const userList = ref([]);

// 查询参数
const queryParams = ref({
    job_name: '',
    university: ''
});

// 组件挂载时加载数据
onMounted(() => {
    handleQuery(); // 初始化加载数据
});

// 查询求职者简历列表
const handleQuery = () => {
    getUserList(queryParams.value)
        .then(res => {
            if (res.data) {
                userList.value = res.data;
            }
        })
        .catch(err => {
            console.error('获取数据失败:', err);
        });
};

// 重置查询条件
const handleReset = () => {
    queryParams.value.job_name = '';
    queryParams.value.university = '';
    handleQuery();
};
</script>

<style scoped></style>
