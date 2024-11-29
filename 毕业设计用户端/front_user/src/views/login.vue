<template>
    <div class="app-container">
        <div class="login-box">
            <h2>登录</h2>
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="phone">手机号</label>
                    <input v-model="loginForm.phone_number" type="tel" id="phone" name="phone" placeholder="请输入手机号"
                        required />
                </div>

                <div class="input-group">
                    <label for="password">密码</label>
                    <input v-model="loginForm.password" type="password" id="password" name="password"
                        placeholder="请输入密码" required />
                </div>

                <button type="submit" class="login-btn">登录</button>
                <el-button type="primary" class="register-btn" @click="register" plain>没有账号？立即注册</el-button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/account';
import { ElMessage } from 'element-plus';
const loginForm = ref({
    phone_number: '',
    password: ''
});

const errorMessage = ref('');
const router = useRouter(); 

const handleLogin = () => {
    login(loginForm.value).then(res => {
        if (res.status === 200) {
            ElMessage.success('登录成功');
            router.push('/index');
            window.location.reload();
            localStorage.setItem('is_login_user_id', res.data.user_id)
        }
    })
};

const register = () => {
    router.push('/register')
}
</script>

<style scoped>
.register-btn {
    margin-top: 20px;
}

.app-container {
    margin: 20px 600px;
}

.login-box {
    width: 400px;
    padding: 40px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.login-box h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 500;
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

.login-btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login-btn:hover {
    background-color: #0056b3;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
