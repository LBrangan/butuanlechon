<script setup>
import { onMounted } from 'vue'
import { useResetPassword } from '@/composables/auth/resetPassword'

const {
  formData,
  formAction,
  refVForm,
  isValidSession,
  onFormSubmit,
  checkSession,
} = useResetPassword()

// Validate session on mount
onMounted(() => {
  checkSession()
})

// Password validation rules
const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v?.length >= 8 || 'Password must be at least 8 characters',
  (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  (v) => /[0-9]/.test(v) || 'Password must contain at least one number',
]

const confirmPasswordRules = [
  (v) => !!v || 'Password confirmation is required',
  (v) => v === formData.password || 'Passwords do not match',
]
</script>

<template>
  <div class="reset-password-form">
    <!-- Invalid Session Alert -->
    <v-alert
      v-if="!isValidSession && formAction.formErrorMessage"
      type="error"
      class="mb-6"
      closable
    >
      {{ formAction.formErrorMessage }}
    </v-alert>

    <!-- Form -->
    <v-form ref="refVForm" v-if="isValidSession" @submit.prevent="onFormSubmit">
      <!-- Password Field -->
      <v-text-field
        v-model="formData.password"
        label="New Password"
        type="password"
        :rules="passwordRules"
        :disabled="formAction.formProcess"
        variant="outlined"
        class="mb-4"
        hint="At least 8 characters, 1 uppercase letter, 1 number"
        persistent-hint
      />

      <!-- Confirm Password Field -->
      <v-text-field
        v-model="formData.passwordConfirm"
        label="Confirm Password"
        type="password"
        :rules="confirmPasswordRules"
        :disabled="formAction.formProcess"
        variant="outlined"
        class="mb-6"
      />

      <!-- Error Message -->
      <v-alert
        v-if="formAction.formErrorMessage"
        type="error"
        class="mb-6"
        closable
      >
        {{ formAction.formErrorMessage }}
      </v-alert>

      <!-- Success Message -->
      <v-alert
        v-if="formAction.formSuccessMessage"
        type="success"
        class="mb-6"
        closable
      >
        {{ formAction.formSuccessMessage }}
      </v-alert>

      <!-- Submit Button -->
      <v-btn
        type="submit"
        color="red-darken-4"
        class="w-full font-weight-bold"
        size="large"
        :loading="formAction.formProcess"
        :disabled="formAction.formProcess"
        block=""
      >
        Reset Password
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.reset-password-form {
  width: 100%;
}
</style>
