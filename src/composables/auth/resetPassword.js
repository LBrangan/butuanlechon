import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useResetPassword() {
  const router = useRouter()

  const formDataDefault = {
    password: '',
    passwordConfirm: '',
  }

  const formData = ref({
    ...formDataDefault,
  })

  const formAction = ref({
    ...formActionDefault,
  })

  const refVForm = ref()
  const isValidSession = ref(false)

  // Check if user has a valid session from reset link
  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        formAction.value.formErrorMessage = 'Invalid or expired reset link. Please request a new one.'
        isValidSession.value = false
        return
      }

      isValidSession.value = true
    } catch (error) {
      console.error('Session check error:', error)
      formAction.value.formErrorMessage = 'Failed to verify reset link.'
      isValidSession.value = false
    }
  }

  // Reset password flow
  const onSubmit = async () => {
    // Reset Form Action utils
    formAction.value = { ...formActionDefault, formProcess: true }

    try {
      // Validate passwords match
      if (formData.value.password !== formData.value.passwordConfirm) {
        formAction.value.formErrorMessage = 'Passwords do not match.'
        formAction.value.formStatus = 400
        formAction.value.formProcess = false
        return
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.value.password,
      })

      if (error) {
        console.error('Supabase reset password error:', error)
        formAction.value.formErrorMessage = error.message || 'Failed to reset password. Please try again.'
        formAction.value.formStatus = error.status || 500
      } else {
        formAction.value.formSuccessMessage = 'Password reset successfully! Redirecting to login...'
        formAction.value.formStatus = 200

        // Reset form after success
        refVForm.value?.reset()

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Reset password exception:', error)
      formAction.value.formErrorMessage = error.message || 'An error occurred. Please try again.'
      formAction.value.formStatus = 500
    }

    // Turn off processing
    formAction.value.formProcess = false
  }

  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
    })
  }

  return {
    formData,
    formAction,
    refVForm,
    isValidSession,
    onFormSubmit,
    checkSession,
  }
}
