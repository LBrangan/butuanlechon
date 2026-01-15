import { createRouter, createWebHistory } from 'vue-router'
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
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },

    {
      path: '/products',
      name: 'products',
      component: ProductView,
    },
    {
      path: '/daily-usage',
      name: 'daily-usage',
      component: DailyUsage,
    },
    {
      path: '/account/settings',
      name: 'account-settings',
      component: AccountSettings,
    }

  ],
})

export default router
