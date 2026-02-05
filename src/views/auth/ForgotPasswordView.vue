<script setup>
import RecoverPassword from '@/components/auth/RecoverPassword.vue';


</script>

<template>
  <div class="auth-container">
    <v-container class="fill-height pa-4">
      <v-row class="align-center justify-center h-100">
        <v-col cols="12" sm="10" md="6" lg="4">
          <!-- Logo/Title Section -->
          <div class="text-center mb-8">
            <h1 class="text-h3 font-weight-bold text-red-darken-4 mb-2">Password Recovery</h1>
            <p class="text-subtitle-1 text-grey">Reset your password to regain access</p>
          </div>

          <!-- Form Card -->
          <v-card class="pa-8 rounded-xl elevation-4" style="border: 2px solid rgba(139, 0, 0, 0.1)">
            <RecoverPassword />
          </v-card>

          <!-- Footer Links -->
          <div class="text-center mt-6">
            <p class="text-caption text-grey">
              Don't have an account?
              <v-btn
                variant="text"
                size="x-small"
                color="red-darken-4"
                class="pa-0 font-weight-bold"
                @click="$router.push('/register')"
              >
                Sign up here
              </v-btn>
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.auth-container {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe4e1 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.fill-height {
  height: 100%;
}

.h-100 {
  height: 100%;
}
</style>
