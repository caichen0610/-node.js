<template>
    <div>
        <el-button type="primary" @click="showResumeModal">我的简历</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
        <div class="job-list">
            <el-card v-for="(job, index) in jobList" :key="index" class="job-card">
                <div class="clearfix">
                    <div><span>职位名称：{{ job.job_name }}</span></div>
                    <div class="address"><span>面试时间：{{ formatDate(job.interview_time) }}</span></div>
                    <div class="address"><span>面试地点：{{ job.interview_location }}</span></div>
                </div>
                <div v-if="job.notice" class="notice">
                    <strong>通知：</strong> {{ job.notice }}
                </div>
                <div class="btn-submit">
                    <el-button type="danger" @click="cancelApplication(job.job_id)">取消投递</el-button>
                </div>
            </el-card>
        </div>
        <el-dialog v-model="dialogVisible" title="编辑我的简历" width="40%">
            <el-form :model="resumeForm" ref="resumeFormRef">
                <el-form-item label="用户名">
                    <el-input v-model="resumeForm.username"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="resumeForm.age"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="resumeForm.phone_number" disabled></el-input>
                </el-form-item>
                <el-form-item label="大学">
                    <el-input v-model="resumeForm.university"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="resumeForm.gender">
                        <el-option label="男" value="male"></el-option>
                        <el-option label="女" value="female"></el-option>
                        <el-option label="其他" value="other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位">
                    <el-input v-model="resumeForm.job_position"></el-input>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input type="textarea" v-model="resumeForm.bio"></el-input>
                </el-form-item>
            </el-form>

            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitResumeForm">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserJob, cancelResume, getUserResume, updateUserResume } from '../api/my';
import { ElMessage, ElMessageBox, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';
import { formatDate } from '../utils/date';
import { useRouter } from 'vue-router';
const router = useRouter();
const jobList = ref([]);
const dialogVisible = ref(false);
const resumeForm = ref({
    username: '',
    age: '',
    phone_number: '',
    university: '',
    gender: '',
    job_position: '',
    bio: ''
});


onMounted(() => {
    const userId = localStorage.getItem('is_login_user_id');
    getUserJob({ user_id: userId })
        .then(response => {
            jobList.value = response.data || [];
        })
        .catch(error => {
            console.error('获取职位数据失败:', error);
            ElMessage.error('获取职位数据失败');
        });
});


const showResumeModal = () => {
    const userId = localStorage.getItem('is_login_user_id');
    getUserResume({ user_id: userId })
        .then(response => {
            resumeForm.value = response.data;
            dialogVisible.value = true;
        })
        .catch(error => {
            console.error('获取简历信息失败:', error);
            ElMessage.error('获取简历信息失败');
        });
};

const cancelApplication = (jobId) => {
    const userId = localStorage.getItem('is_login_user_id');
    const params = {
        user_id: userId,
        job_id: jobId
    };

    cancelResume(params)
        .then(response => {
            ElMessage.success('取消投递成功');
            jobList.value = jobList.value.filter(job => job.job_id !== jobId);
        })
        .catch(error => {
            console.error('取消投递失败:', error);
            ElMessage.error('取消投递失败');
        });
};

const submitResumeForm = () => {
    const userId = localStorage.getItem('is_login_user_id');
    const formData = { ...resumeForm.value, user_id: userId };

    updateUserResume(formData)
        .then(response => {
            ElMessage.success('简历更新成功');
            dialogVisible.value = false;
        })
        .catch(error => {
            console.error('简历更新失败:', error);
            ElMessage.error('简历更新失败');
        });
};

const logout = () => {
    ElMessageBox.confirm(
        '您确定要退出登录吗？',
        '退出登录',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {

        localStorage.removeItem('is_login_user_id');
        router.push('/index')
        ElMessage.success('成功退出登录');
        window.location.reload();
    }).catch(() => {

        ElMessage.info('取消退出登录');
    });
};
</script>

<style scoped>
.job-list {
    margin: 20px;
}

.job-card {
    margin-bottom: 20px;
}

.address {
    padding-top: 10px;
}

.notice {
    margin-top: 10px;
    padding: 10px;
    background-color: #f4f4f4;
}

.btn-submit {
    display: flex;
    flex-direction: row-reverse;
}
</style>