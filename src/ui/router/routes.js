import { changeLanguageGuard } from '.';

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/ui/pages/home/Home.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('@/ui/pages/statistics/Statistics.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/ui/pages/auth/Login.vue'),
    meta: {
      isPublicOnly: true,
    },
  },
  {
    path: '/:path(.*)',
    component: () => import('@/ui/pages/NotFound.vue'),
  },
  {
    path: '/en',
    beforeEnter: changeLanguageGuard('en'),
  },
  {
    path: '/es',
    beforeEnter: changeLanguageGuard('es'),
  },
]
