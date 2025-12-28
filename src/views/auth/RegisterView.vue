<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
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

                <v-divider class="my-2"></v-divider>
                <RegisterForm></RegisterForm>

                <h5>
                  Already have an account?
                  <router-link to="/" class="text-decoration-none">Sign in here</router-link>
                </h5>
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
