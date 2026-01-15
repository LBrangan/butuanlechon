import { createRouter, createWebHistory } from 'vue-router'

// Views
import ReportView from '@/views/auth/ReportView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductView from '@/views/ProductView.vue'
import DailyUsage from '@/views/DailyUsage.vue'
import AccountSettings from '@/views/system/AccountSettings.vue'

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
    {
      path: '/reports',
      name: 'reports',
      component: ReportView,
    },
    {
      path: '/account/settings',
      name: 'account-settings',
      component: AccountSettings,
    }

  ],
})

export default router
