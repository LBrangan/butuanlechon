import { supabase } from '@/utils/supabase'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthUserStore = defineStore('authUser', () => {
  // States
  const userData = ref(null)
  const authPages = ref([])
  const authBranchIds = ref([])

  // Getters
  // Computed Properties; Use for getting the state but not modifying its reactive state
  const userRole = computed(() => {
    return userData.value?.is_admin ? 'Super Administrator' : userData.value.user_role
  })

  // Reset State Action
  function $reset() {
    userData.value = null
    authPages.value = []
    authBranchIds.value = []
  }

  // Actions
  // Retrieve User Session if Logged
  async function isAuthenticated() {
    const { data } = await supabase.auth.getSession()

    if (data.session) {
      const { id, email, user_metadata } = data.session.user
      userData.value = { id, email, ...user_metadata }
    }

    return !!data.session
  }

  // Retrieve User Information
  async function getUserInformation() {
    const {
      data: {
        // Retrieve Id, Email and Metadata thru Destructuring
        user: { id, email, user_metadata },
      },
    } = await supabase.auth.getUser()

    // Set the retrieved information to state
    userData.value = { id, email, ...user_metadata }
  }

  // Retrieve User Roles Pages
  async function getAuthPages(name) {
    const { data } = await supabase
      .from('user_roles')
      .select('*, pages: user_role_pages (page)')
      .eq('user_role', name)

    // Set the retrieved data to state
    if (data.length > 0) authPages.value = data[0].pages.map((p) => p.page)
  }

  // Retrieve Branch Ids
  async function getAuthBranchIds() {
    const { data } = await supabase
      .from('branches')
      .select('id')
      .in('name', userData.value.branch.split(','))

    authBranchIds.value = data.map((b) => b.id)
  }

  // Update User Information
  async function updateUserInformation(updatedData) {
    const {
      data: {
        // Retrieve Id, Email and Metadata thru Destructuring
        user: { id, email, user_metadata },
      },
      error,
    } = await supabase.auth.updateUser({
      data: {
        ...updatedData,
      },
    })

    // Check if it has error
    if (error) {
      return { error }
    }
    // If no error set updatedData to userData state
    else if (user_metadata) {
      userData.value = { id, email, ...user_metadata }

      return { data: userData.value }
    }
  }

  // Update User Profile Image
  async function updateUserImage(file) {
    // 1. Ensure user is loaded
    if (!userData.value?.id) {
      await getUserInformation()
    }

    if (!userData.value?.id) {
      return { error: { message: 'User not authenticated', status: 401 } }
    }

    const filePath = `${userData.value.id}-avatar.png`

    try {
      // 2. Upload to the CORRECT bucket with cache-busting parameter
      const { data, error } = await supabase.storage
        .from('butuanlechon') // ✅ must exist
        .upload(filePath, file, {
          cacheControl: '0', // No cache - always get fresh image
          upsert: true,
          contentType: file.type || 'image/png',
        })

      if (error) {
        console.error('UPLOAD ERROR:', error)
        return { error: { message: error.message, status: error.status || 500 } }
      }

      // 3. Get public URL from SAME bucket with cache-busting timestamp
      const timestamp = new Date().getTime()
      const { data: imageData } = supabase.storage.from('butuanlechon').getPublicUrl(filePath)
      const cacheBustedUrl = `${imageData.publicUrl}?t=${timestamp}`

      // 4. Save URL to user metadata with slight delay to ensure CDN propagation
      await new Promise(resolve => setTimeout(resolve, 200))

      return await updateUserInformation({
        image_url: cacheBustedUrl,
      })
    } catch (err) {
      console.error('UPDATE IMAGE ERROR:', err)
      return { error: { message: err.message, status: 500 } }
    }
  }

  return {
    userData,
    userRole,
    authPages,
    authBranchIds,
    $reset,
    isAuthenticated,
    getUserInformation,
    getAuthPages,
    getAuthBranchIds,
    updateUserInformation,
    updateUserImage,
  }
})
