<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const formValid = ref(true)

const rules = {
  firstName: [(v) => !!v || 'First name is required'],
  lastName: [(v) => !!v || 'Last name is required'],
  email: [(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid'],
  password: [
    (v) => !!v || 'Password is required',
    (v) => v.length >= 6 || 'Password must be at least 6 characters',
  ],
  confirmPassword: [
    (v) => !!v || 'Please confirm your password',
    (v) => v === form.value.password || 'Passwords must match',
  ],
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // TODO: Implement actual login logic here
    // await loginUser(form.value)
    router.push('/Dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
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

                <v-form @submit.prevent="handleSubmit" v-model="formValid">
                  <v-card-text>
                    <v-text-field
                      v-model="form.firstName"
                      label="First Name"
                      prepend-inner-icon="mdi-account"
                      :rules="rules.firstName"
                      required
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.lastName"
                      label="Last Name"
                      prepend-inner-icon="mdi-account"
                      :rules="rules.lastName"
                      required
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.email"
                      label="Email"
                      prepend-inner-icon="mdi-email"
                      type="email"
                      :rules="rules.email"
                      required
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append-inner="showPassword = !showPassword"
                      :rules="rules.password"
                      required
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.confirmPassword"
                      label="Confirm Password"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      @click:append-inner="showConfirmPassword = !showConfirmPassword"
                      :rules="rules.confirmPassword"
                      required
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
