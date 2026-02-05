<script setup>
import { ref } from 'vue'
import { emailValidator } from '@/utils/validators'
import { useForgotPassword } from '@/composables/auth/forgotPassword'
import AlertNotification from '@/common/AlertNotification.vue'

const { formData, formAction, refVForm, onFormSubmit } = useForgotPassword()
const showBackToLogin = ref(false)


const recoverPassword = async () => {
  StaticRange.error = undefined;
  if (!validateEmail(state.email)) {
    state.error = "Please enter a valid email address.";
    return
  }
  try {
    state.loading = true;
    let { data, error} = await supabase
    .auth
    .resetPasswordForEmail(state.email)

    if (data) {
      state.success = "Password recovery email sent. Please check your inbox."
    }
  } catch (error) {
      state.error = error.message;
    } finally {
      state.loading = false;
  }
}
</script>

<template>
  <div>
    <AlertNotification
      :form-success-message="formAction.formSuccessMessage"
      :form-error-message="formAction.formErrorMessage"
    />

    <!-- Success state with redirect option -->
    <div v-if="formAction.formSuccessMessage && !formAction.formProcess" class="text-center py-4">
      <p class="text-body-2 text-grey mt-2">Check your email for password reset instructions.</p>
      <v-btn
        class="mt-4"
        variant="outlined"
        color="red-darken-4"
        @click="$router.push('/')"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Login
      </v-btn>
    </div>

    <!-- Form state -->
    <v-form v-else ref="refVForm" @submit.prevent="onFormSubmit">
      <v-row dense>
        <v-col cols="12">
          <p class="text-subtitle-2 mb-4 text-grey">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.email"
            label="Email Address"
            prepend-inner-icon="mdi-email-outline"
            :rules="[emailValidator]"
            placeholder="your@email.com"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        class="mt-2"
        type="submit"
        color="red-darken-4"
        prepend-icon="mdi-email-send-outline"
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
        block
      >
        Send Reset Email
      </v-btn>

      <v-btn
        variant="text"
        color="grey"
        class="mt-2"
        size="small"
        block
        @click="$router.push('/')"
      >
        <v-icon start size="small">mdi-arrow-left</v-icon>
        Back to Login
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
</style>
