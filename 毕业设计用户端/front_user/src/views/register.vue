<template>
    <div class="app-container">
        <div class="register-box">
            <h2>注册</h2>
            <form @submit.prevent="handleRegister">
                <div class="input-group">
                    <label for="username">用户名</label>
                    <input v-model="registerForm.username" type="text" id="username" name="username"
                        placeholder="请输入用户名" required />
                </div>

                <div class="input-group">
                    <label for="phone">手机号</label>
                    <input v-model="registerForm.phone_number" type="tel" id="phone" name="phone" placeholder="请输入手机号"
                        required />
                </div>

                <div class="input-group">
                    <label for="password">密码</label>
                    <input v-model="registerForm.password" type="password" id="password" name="password"
                        placeholder="请输入密码" required />
                </div>

                <button type="submit" class="register-btn">注册</button>
                <el-button type="primary" @click="goToLogin" plain>已有账号？立即登录</el-button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../api/account';
import { ElMessage } from 'element-plus';

const registerForm = ref({
    username: '',
    phone_number: '',
    password: ''
});

const errorMessage = ref('');
const router = useRouter(); 
const handleRegister = () => {
    register(registerForm.value).then(res => {
        if (res.status === 201) {
            ElMessage.success('注册成功，将立即跳转到登录界面');
            router.push('/login');
        }
    })
};
const goToLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
.app-container {
    margin: 20px 600px;
}

.register-box {
    width: 400px;
    padding: 40px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.register-box h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 500;
}

.el-button {
    margin-top: 20px;
}

.input-group {
    margin-bottom: 20px;
    text-align: left;
}

.input-group label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.register-btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: white;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.register-btn:hover {
    background-color: #218838;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
