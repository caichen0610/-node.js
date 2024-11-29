<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="log" style="font-size: 28px;">招聘企业管理</div>
        <div class="btn">
          <div class="name">欢迎您：{{ name }}</div>
          <el-button type="primary" plain @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item index="1" @click="$router.push('/main/jobPosition')">
              <span>职位管理</span>
            </el-menu-item>
            <el-menu-item index="2" @click="$router.push('/main/resume')">
              <span>简历管理</span>
            </el-menu-item>
            <el-menu-item index="3" @click="$router.push('/main/interView')">
              <span>面试管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');


onMounted(() => {
  name.value = localStorage.getItem('name') || '未知用户';
});


const logout = () => {
  localStorage.removeItem('is_login_id');
  localStorage.removeItem('name');
  router.push({ name: 'login' });
};
</script>

<style scoped>
.el-menu-item {
  background-color: rgb(197.7, 225.9, 255);
}

.el-menu-item span {
  padding-left: 30px;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(121.3, 187.1, 255);
}

.el-aside {
  height: 100vh;
  background-color: rgb(197.7, 225.9, 255);
}

.btn {
  display: flex;
}

.name {
  padding-right: 20px;
  display: flex;
  align-items: center;
}
</style>
