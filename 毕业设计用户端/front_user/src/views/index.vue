<template>
    <div>
        <div class="search-box">
            <el-input v-model="query.job_name" placeholder="请输入职位名称" class="input-item" clearable />
            <el-input v-model="query.address" placeholder="请输入工作地点" class="input-item" clearable />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="refresh" plain>重置</el-button>
        </div>

        <div class="job-list">
            <el-card v-for="(job, index) in jobList" :key="index" class="job-card">
                <div class="clearfix">
                    <div><span>职位名称：{{ job.job_name }}</span></div>
                    <div class="address"><span>地址：{{ job.address }}</span></div>
                </div>
                <div class="company_name">
                    <div>企业：{{ job.company_name }}</div>
                </div>
                <div>
                    <p>职位描述：{{ job.job_description }}</p>
                    <p>薪资范围：{{ job.salary }}</p>
                </div>
                <div class="btn-submit">
                    <el-button type="primary" @click="submit(job.job_id)">投递简历</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getList, submitResume } from '../api/index';
import { ElMessage } from 'element-plus';

const query = ref({
    job_name: '',
    address: ''
});

const jobList = ref([]);

onMounted(() => {
    handleSearch();
});


const handleSearch = () => {
    getList(query.value)
        .then(response => {
            jobList.value = response.data || [];
        })
        .catch(error => {
            console.error('Error fetching job details:', error);
        });
};


const refresh = () => {
    query.value = {
        job_name: '',
        address: ''
    };
    handleSearch();
};


const submit = (jobId) => {
    const userId = localStorage.getItem('is_login_user_id');
    if (!userId) {
        ElMessage.error('请先登录');
        return;
    }
    submitResume({ user_id: userId, job_id: jobId })
        .then(response => {
            ElMessage.success('简历投递成功');
        })
        .catch(error => {
            ElMessage.error('简历投递失败');
        });
};
</script>

<style scoped>
.search-box {
    margin: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
}

.company_name {
    font-size: 28px;
    padding-right: 200px;
    display: flex;
    justify-content: flex-end;
}

.address {
    padding-top: 15px;
}

.btn-submit {
    display: flex;
    flex-direction: row-reverse
}

.input-item {
    width: 200px;
}

.job-list {
    margin: 20px;
}

.clearfix {
    height: 30px;
    align-items: center;
}

.job-card {
    margin-bottom: 20px;
}
</style>
