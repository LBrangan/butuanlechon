import { supabase, formActionDefault } from '@/utils/supabase'
import { ref } from 'vue'

export function useForgotPassword() {
  const formDataDefault = {
    email: '',
  }

  const formData = ref({
    ...formDataDefault,
  })

  const formAction = ref({
    ...formActionDefault,
  })

  const refVForm = ref()

  // Password recovery flow
  const onSubmit = async () => {
    // Reset Form Action utils
    formAction.value = { ...formActionDefault, formProcess: true }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formData.value.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      )

      if (error) {
        console.error('Supabase reset password error:', error)
        formAction.value.formErrorMessage =
          error.message || 'Failed to send reset email. Please try again.'
        formAction.value.formStatus = error.status || 500
      } else {
        formAction.value.formSuccessMessage =
          'Password reset email sent! Check your inbox for further instructions.'
        formAction.value.formStatus = 200

        // Reset form after success
        refVForm.value?.reset()
      }
    } catch (error) {
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

  return { formData, formAction, refVForm, onFormSubmit }
}
