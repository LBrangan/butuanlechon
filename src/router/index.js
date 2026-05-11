import { createRouter, createWebHistory } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthUserStore()

  // Step 1 — check session
  const isLoggedIn = await authStore.isAuthenticated()

  // Redirect home
  if (to.name === 'home') {
    return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
  }

  // Prevent logged-in users from hitting login/register
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }

  // Require auth
  if (!isLoggedIn && to.meta.requiresAuth) {
    return { name: 'login' }
  }

  if (isLoggedIn) {
    // Step 2 — ensure userData is populated (needed for userRole computed)
    if (!authStore.userData) await authStore.getUserInformation()

    // Step 3 — ensure branch IDs are loaded (needed for inventory queries)
    if (authStore.authBranchIds.length === 0) await authStore.getAuthBranchIds()

    const isSuperAdmin = authStore.userRole === 'Super Administrator'

    if (!isSuperAdmin) {
      // Step 4 — always reload authPages if empty (happens on every refresh)
      // Pass userRole directly from userData to avoid computed timing issues
      const roleName = authStore.userData?.user_role || authStore.userData?.role
      if (authStore.authPages.length === 0 && roleName) {
        await authStore.getAuthPages(roleName)
      }

      const isAccessible = authStore.authPages.includes(to.path)

      if (!isAccessible && !to.meta.isDefault) {
        return { name: 'forbidden' }
      }
    }
  }
})

export default router
