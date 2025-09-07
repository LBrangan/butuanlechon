<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = ref({
  email: '',
  password: '',
})
const showPassword = ref(false)
const formValid = ref(true)

const rules = {
  email: [(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid'],
  password: [
    (v) => !!v || 'Password is required',
    (v) => v.length >= 6 || 'Password must be at least 6 characters',
  ],
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // TODO: Implement actual login logic here
    // await loginUser(form.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="fill-height bg-red-lighten-1 pa-0">
    <v-row align="center" justify="center" class="ga-15">
      <v-col cols="10" sm="8" md="6" lg="4">
        <v-img
          max-height="400"
          class="mx-auto"
          :src="`/images/Background.png`"
          cover
          rounded="lg"
          shadow="lg"
        ></v-img>
      </v-col>

      <v-col cols="10" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4" prepend-icon="mdi-account-alert" subtitle="Login Form">
          <template v-slot:title>
            <span class="font-weight-black"> BL & SG Restaurant </span>
          </template>

          <v-form @submit.prevent="handleSubmit" v-model="formValid">
            <v-card-text>
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
                color="#ff5050"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
