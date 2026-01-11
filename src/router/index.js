import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/supabase.js'

// Views
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductView from '@/views/ProductView.vue'
import DailyUsage from '@/views/DailyUsage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        role: 'Admin',
      },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductView,
      meta: {
        requiresAuth: true,
        role: 'Admin',
      },
    },
    {
      path: '/daily-usage',
      name: 'daily-usage',
      component: DailyUsage,
      meta: {
        requiresAuth: true,
        role: 'Admin',
      },
    },
  ],
})
router.beforeEach(async (to) => {
  const session = await isAuthenticated()
  const role = session?.user?.user_metadata?.role

  // NOT logged in pero gi-access ang protected page
  if (!session && to.meta.requiresAuth) {
    return { name: 'login' }
  }

  // LOGGED IN pero gi-access ang login/register via URL
  if (session && to.meta.guestOnly) {
    return { name: 'dashboard' }
  }

  // LOGGED IN pero sayop ang role
  if (session && to.meta.requiresAuth && to.meta.role && to.meta.role !== role) {
    console.warn(`Access denied for role: ${role}`)
    return { name: 'dashboard' }
  }

  return true
})

export default router
