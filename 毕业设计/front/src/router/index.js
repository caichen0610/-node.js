import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/main.vue'),
      children: [
        {
          path: 'jobPosition',
          name: 'jobPosition',
          component: () => import('../views/jobPosition.vue'),
        },
        {
          path: 'resume',
          name: 'resume',
          component: () => import('../views/resume.vue'),
        },
        {
          path: 'interView',
          name: 'interView',
          component: () => import('../views/interView.vue'),
        },
      ],
    },
  ],
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('is_login_id');

  if (to.name !== 'login' && !isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
