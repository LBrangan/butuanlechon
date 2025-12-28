<script setup>
import { ref } from 'vue'
import { useRegister } from '@/composables/auth/register'
import AlertNotification from '@/common/AlertNotification.vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'

const { formData, formAction, refVForm, onFormSubmit } = useRegister()

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-card-text>
      <v-text-field
        v-model="formData.firstname"
        label="First Name"
        prepend-inner-icon="mdi-account"
        :rules="[requiredValidator]"
        variant="outlined"
      />

      <v-text-field
        v-model="formData.lastname"
        label="Last Name"
        prepend-inner-icon="mdi-account"
        :rules="[requiredValidator]"
        required
        variant="outlined"
      />

      <v-text-field
        v-model="formData.email"
        label="Email"
        prepend-inner-icon="mdi-email"
        type="email"
        :rules="[requiredValidator, emailValidator]"
        required
        variant="outlined"
      />

      <v-text-field
        v-model="formData.password"
        label="Password"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="isPasswordVisible ? 'text' : 'password'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        :rules="[requiredValidator, passwordValidator]"
        required
        variant="outlined"
      />

      <v-text-field
        v-model="formData.password_confirmation"
        label="Password Confirmation"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="isPasswordConfirmVisible ? 'text' : 'password'"
        @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
        :rules="[
          requiredValidator,
          confirmedValidator(formData.password_confirmation, formData.password),
        ]"
        required
        variant="outlined"
      />
    </v-card-text>

    <v-btn
      class="mt-2"
      variant="flat"
      size="large"
      rounded="lg"
      type="submit"
      block
      text="black"
      color="#0D47A1"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Register
    </v-btn>
  </v-form>
</template>
