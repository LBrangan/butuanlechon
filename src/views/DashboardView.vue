<script setup>
import { useRouter } from 'vue-router'
import {ref} from 'vue'
import Navigation from '@/components/layout/navigation/Navigation.vue'


const searchQuery = ref('')
const router = useRouter()

const stats = ref([
  { title: 'Total Products', value: 1200, icon: 'mdi-package-variant' },
  { title: 'Low Stock Items', value: 45, icon: 'mdi-alert-circle-outline' },
  { title: 'Total Revenue', value: 15000, icon: 'mdi-currency-usd' },
  { title: 'Orders Today', value: 8, icon: 'mdi-eye-outline' },
])



const addProduct = () => {
  console.log('Add product clicked')
  alert('Add Product functionality will be implemented here!')
}

const handleLogout = () => {
  router.push('/')
}
</script>

<template>
  <v-main class="app-background">
    <NavigationDrawer
      :drawer="drawer"
      :menuItems="menuItems"
      @setActiveItem="setActiveItem"
      @logout="handleLogout"

    />

    <!-- Main Content -->
    <v-container class="pa-8">
      <!-- Header -->
       <div class="align-items-lg-center">
        <h1 class="mb-5">Dashboard</h1>
         <!-- Statistics Cards -->
      <v-row class="mb-2 bg-blue-lighten-1 pa-6 rounded-xl">
        <v-col cols="12" md="6" lg="6" v-for="stat in stats.slice(0, 2)" :key="stat.title">
          <v-card class="pa-8 rounded-xl" elevation="0" color="white" height="160">
            <div class="d-flex justify-space-between align-center h-100">
              <div class="d-flex flex-column justify-center">
                <h2 class="text-h3 font-weight-bold text-grey-darken-4 mb-3">
                  {{ stat.value.toLocaleString() }}
                </h2>
                <p class="text-h6 text-grey-darken-1 mb-0 font-weight-regular">{{ stat.title }}</p>
              </div>
              <v-icon size="60" class="text-grey-darken-2">
                {{ stat.icon }}
              </v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>

       <!-- Recent Activities -->
      <v-row>
        <v-col cols="12 bg-blue-lighten-1 pa-6 rounded-xl">
          <v-card class="pa-10 rounded-xl" elevation="0" color="white" min-height="450">
            <h2 class="text-h4 font-weight-medium text-grey-darken-4 mb-8">Recent Activities</h2>
            <v-divider class="mb-12"></v-divider>
            <div class="text-center py-16">
              <v-icon size="100" class="text-grey-lighten-2 mb-6"
                >mdi-clipboard-list-outline</v-icon
              >
              <p class="text-h5 text-grey-lighten-1 mb-8 font-weight-regular">
                No activities yet. Start by adding products!
              </p>
              <v-btn
                color="blue-darken-2"
                size="large"
                rounded="xl"
                class="px-8 py-3 text-body-1 font-weight-medium"
                elevation="0"
                @click="addProduct"
              >
                <v-icon start size="20">mdi-plus</v-icon>
                Add Product
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
       </div>




    </v-container>
  </v-main>
</template>

<style scoped>

.v-field.v-field--outlined {
  border: 1px solid #ccc !important;
}
.v-field.v-field--outlined:hover {
  border-color: #1976D2 !important;
}
</style>
