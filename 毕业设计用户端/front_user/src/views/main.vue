<template>
    <div class="container">
        <div class="top">
            <!-- 顶部区域 -->
        </div>

        <!-- 导航菜单 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
            @select="handleSelect">
            <el-menu-item index="0">
                <h3 style="color: #409EFF;">在线招聘系统</h3>
            </el-menu-item>
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">登录</el-menu-item>
            <el-menu-item index="3">注册</el-menu-item>
            <el-menu-item index="4" v-show="visible">我的</el-menu-item>
        </el-menu>

        <div class="main">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const activeIndex = ref('1')

const visible = ref(false)

onMounted(() => {
    router.push('/index');
    if (localStorage.getItem('is_login_user_id')) {
        visible.value = true;
    }
})


const handleSelect = (index) => {
    switch (index) {
        case '1':
            router.push('/index')
            break
        case '2':
            router.push('/login')
            break
        case '3':
            router.push('/register')
            break
        case '4':
            router.push('/my')
            break
    }
}
</script>

<style scoped>
.top {
    width: 100%;
    height: 600px;
    background-color: aqua;
    background-image: url('../assets/7456F5A2A799321277415F3C5F2454C7.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}

.main {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 660px);
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>
