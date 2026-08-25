import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, languageGuard, routes } from '@/ui/router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)
router.beforeEach(languageGuard)
