<template>
    <div>
        <el-table :data="applications" style="width: 100%">
            <el-table-column prop="job_name" label="职位名称" width="250" />
            <el-table-column prop="username" label="求职者名" width="150" />
            <el-table-column prop="interview_time" label="面试时间" width="200">
                <template #default="scope">
                    {{ formatDate(scope.row.interview_time) }}
                </template>
            </el-table-column>
            <el-table-column prop="interview_location" label="面试地点" width="250" />
            <el-table-column prop="notice" label="通知" width="400" />
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button @click="handleNotifyInterview(row)" type="primary">通知面试</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" title="通知面试" width="500px" @close="resetDialog">
            <el-form :model="currentInterview" label-width="100px">
                <el-form-item label="面试时间">
                    <el-date-picker v-model="currentInterview.interview_time" type="date" placeholder="选择面试时间"
                        style="width: 100%" data-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="面试地点">
                    <el-input v-model="currentInterview.interview_location" placeholder="输入面试地点" style="width: 100%" />
                </el-form-item>
                <el-form-item label="通知">
                    <el-input v-model="currentInterview.notice" placeholder="输入通知内容" type="textarea"
                        style="width: 100%" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitInterview">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { formatDate } from '../utils/date'
import { ref, onMounted } from 'vue';
import { getUserJob, updateInterView } from '../api/interView';


const applications = ref([]);


const dialogVisible = ref(false);


const currentInterview = ref({
    user_id: null,
    interview_time: '',
    interview_location: '',
    notice: ''
});

// 获取用户投递的职位信息
onMounted(() => {
    fetchUserJobApplications();
});

// 获取用户投递的职位数据
const fetchUserJobApplications = () => {
    getUserJob({})
        .then(res => {
            if (res.applications) {
                applications.value = res.applications;
            }
        })
        .catch(err => {
            console.error('获取职位申请失败:', err);
        });
};

const handleNotifyInterview = (row) => {
    currentInterview.value = { ...row };
    dialogVisible.value = true;
};

// 提交修改的面试信息
const submitInterview = () => {
    // 格式化面试时间，去掉时间部分
    currentInterview.value.interview_time = formatDate(currentInterview.value.interview_time);

    updateInterView(currentInterview.value)
        .then(res => {
            if (res.data) {
                const index = applications.value.findIndex(item => item.user_id === currentInterview.value.user_id);
                if (index !== -1) {
                    applications.value[index] = { ...currentInterview.value };
                }
                dialogVisible.value = false;
                fetchUserJobApplications();
            }
        })
        .catch(err => {
            console.error('更新面试信息失败:', err);
        });
};

// 重置对话框数据
const resetDialog = () => {
    currentInterview.value = {
        user_id: null,
        interview_time: '',
        interview_location: '',
        notice: ''
    };
};
</script>

<style scoped>
/* 可以根据需要自定义样式 */
</style>
