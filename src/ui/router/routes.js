import { changeLanguageGuard } from '.'

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/ui/pages/home/Home.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/people',
    name: 'People',
    component: () => import('@/ui/pages/people/People.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/ui/pages/auth/Login.vue'),
    meta: {
      isPublicOnly: true,
    },
  },
  {
    path: '/:pathMatch(.*)',
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
