import { supabase, formActionDefault } from '@/utils/supabase.js'
import { ref } from 'vue'

export function useRegister(onSuccess) {
  // ← accept callback, remove router
  const formDataDefault = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
  }
  const formData = ref({ ...formDataDefault })
  const formAction = ref({ ...formActionDefault })
  const refVForm = ref()

  const onSubmit = async () => {
    formAction.value = { ...formActionDefault, formProcess: true }

    const { data, error } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          firstname: formData.value.firstname,
          lastname: formData.value.lastname,
          is_admin: false,
          role: '',
          branch: '',
        },
      },
    })

    if (error) {
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
      formAction.value.formProcess = false
      refVForm.value?.reset()
    } else if (data) {
      await supabase.auth.signOut()

      formAction.value.formSuccessMessage = 'Successfully Registered Account.'
      formAction.value.formProcess = false

      const email = formData.value.email
      refVForm.value?.reset()

      // ← trigger dialog instead of redirecting
      if (onSuccess) onSuccess(email)
    }
  }

  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
    })
  }

  return { formData, formAction, refVForm, onFormSubmit }
}
