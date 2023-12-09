import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import authGuard from '../service/AuthGuard';

const router = createRouter({
  history: createWebHashHistory(),
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/pages/landing/landing.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/login/login.vue')
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          beforeEnter: authGuard
        },
        {
          path: '/usuarios',
          name: 'usuarios',
          component: () => import('@/views/pages/usuarios/usuarios.vue'),
          beforeEnter: authGuard
        },
        {
          path: '/equipes',
          name: 'equipes',
          component: () => import('@/views/pages/equipes/equipes.vue'),
          beforeEnter: authGuard
        },
        {
          path: '/okr',
          name: 'okr',
          component: () => import('@/views/pages/okr/okr.vue'),
          beforeEnter: authGuard
        },
        {
          path: '/logout',
          name: 'logout',
          component: () => import('@/views/pages/logout/logout.vue')
        }
      ]
    }
  ]
});

export default router;
