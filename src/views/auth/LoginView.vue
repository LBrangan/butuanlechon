<script setup>
  import LoginForm from '@/components/auth/LoginForm.vue';

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

                <LoginForm></LoginForm>

                <v-divider class="my-5"></v-divider>

                <h5 class="text-center">
                  Don't have an account?
                  <router-link to="/register" class="text-decoration-none"
                      >Register Here</router-link
                    >
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
