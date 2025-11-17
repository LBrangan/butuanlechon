<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators.js'
import { ref } from 'vue'

const isPasswordVissible = ref(false)
const refVFrom = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({ ...formDataDefault })

const onLogin = () => {
  alert(formData.value)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {
      onLogin()
    }
  })
}
</script>

<template>
  <v-responsive>
    <v-app>
      <v-main>
        <v-container fluid class="fill-height bg-blue-lighten-1 d-flex flex-wrap">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center">
              <v-avatar size="180">
                <v-img class :src="`/images/Background.png`" cover alt="logo"></v-img>
              </v-avatar>
            </v-col>

            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card
                class="elevation-12 pa-4"
                prepend-icon="mdi-account"
                subtitle="Inventory Management System"
              >
                <template v-slot:title>
                  <span class="font-weight-black"> BL & SG Restaurant </span>
                </template>

                <v-form ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
                  <v-card-text>
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      prepend-inner-icon="mdi-email"
                      type="email"
                      :rules="[requiredValidator, emailValidator]"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="formData.password"
                      label="Password"
                      prepend-inner-icon="mdi-lock"
                      :type="isPasswordVissible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVissible ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="isPasswordVissible = !isPasswordVissible"
                      :rules="[requiredValidator]"
                      variant="outlined"
                    />
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      class="none"
                      variant="flat"
                      size="large"
                      rounded="lg"
                      :loading="loading"
                      type="submit"
                      block
                      text="black"
                      color="#0D47A1"
                    >
                      Login
                    </v-btn>
                  </v-card-actions>
                  <v-divider class="my-2"></v-divider>
                  <h5>
                    Don't have an account?
                    <router-link to="/register" class="text-decoration-none"
                      >Register Here</router-link
                    >
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
