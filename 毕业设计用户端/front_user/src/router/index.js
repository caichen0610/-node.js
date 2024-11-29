import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 首页
      path: '/',
      name: 'main',
      component: () => import('../views/main.vue'),
      children: [
        {
          // index
          path: 'index',
          name: 'index',
          component: () => import('../views/index.vue'),
        },
        {
          // 我的
          path: 'my',
          name: 'my',
          component: () => import('../views/my.vue'),
        },
        {
          // 登录
          path: 'login',
          name: 'login',
          component: () => import('../views/login.vue'),
        },
        {
          // 注册
          path: 'register',
          name: 'register',
          component: () => import('../views/register.vue'),
        },
      ]
    },

  ],
})

export default router
