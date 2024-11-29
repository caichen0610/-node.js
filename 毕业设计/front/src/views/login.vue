<template>
  <div class="app-container">
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="phone">手机号</label>
          <input v-model="formList.phone" type="tel" id="phone" name="phone" placeholder="请输入手机号" required />
        </div>

        <div class="input-group">
          <label for="password">密码</label>
          <input v-model="formList.password" type="password" id="password" name="password" placeholder="请输入密码"
            required />
        </div>

        <button type="submit" class="login-btn">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '../api/login'; // 假设你有一个 login API 用于验证用户信息

// 定义响应式数据
const formList = ref({
  phone: '',
  password: '',
});

// 获取 Vue Router 实例
const router = useRouter();

// 登录处理方法
const handleLogin = () => {
  login(formList.value).then(res => {
    console.log(res);
    if (res.status === 200) {
      ElMessage.success('登录成功');
      localStorage.setItem('is_login_id', res.userId);
      localStorage.setItem('name', res.name);
      // 路由跳转到 main 页面
      router.push('/main/jobPosition');
    } else {
      // 如果登录失败，可以在这里显示错误信息
      ElMessage.error('登录失败，请检查用户名和密码');
    }
  }).catch(error => {
    ElMessage.error('发生错误，请稍后再试');
    console.error(error);
  });
};
</script>

<style scoped>
.app-container {
  margin: 250px 600px;
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
</style>
