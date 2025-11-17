<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators.js'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const formDataDefault = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVForm = ref()

const onSubmit = () => {}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-alert
    v-if="formAction.formSuccessMessage"
    :text="formAction.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  >
  </v-alert>
  <v-alert
    v-if="formAction.formErrorMessage"
    :text="formAction.formErrorMessage"
    title="Ooops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  >
  </v-alert>
  <v-responsive>
    <v-app>
      <v-main>
        <v-container fluid class="fill-height bg-blue-lighten-1 d-flex flex-wrap">
          <v-row class="justify-center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card
                class="elevation-12 pa-4"
                prepend-icon="mdi-account-plus"
                subtitle="Create your account"
              >
                <template v-slot:title>
                  <span class="font-weight-black">BL & SG Restaurant</span>
                </template>

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

                  <v-card-actions>
                    <v-spacer />
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
                  </v-card-actions>
                  <v-divider class="my-2"></v-divider>
                  <h5>
                    Already hava an account?
                    <router-link to="/" class="text-decoration-none">Sign in here</router-link>
                  </h5>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
