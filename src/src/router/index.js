import { createRouter, createWebHashHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { noAuth: true } },
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.noAuth) return next()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return next('/login')
  next()
})

export default router
