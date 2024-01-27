import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import authGuard from '../middleware/AuthGuard';
import isAdmin from '../middleware/isAdmin';

const router = createRouter({
  history: createWebHistory(),
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
      path: '/dashboard',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          beforeEnter: authGuard
        },
        {
          path: '/planejamento',
          name: 'planejamento',
          component: () => import('@/views/pages/planejamento/planejamento.vue')
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
          path: '/painel',
          name: 'painel',
          component: () => import('@/views/pages/painel/painel.vue'),
          beforeEnter: [authGuard, isAdmin]
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
