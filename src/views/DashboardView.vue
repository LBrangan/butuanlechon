<script setup>
import { useRouter } from 'vue-router'
import {ref} from 'vue'
import NavigationDrawer from '@/components/layout/navigation/NavigationDrawer.vue'  // Add this import


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
    <v-container fluid class="pa-8">
      <!-- Header -->
      <v-row class="mb-8">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="text-h3 font-weight-bold text-grey-darken-4">Dashboard</h1>

          <!-- Custom Search Bar -->
          <div class="search-box">
            <v-icon size="20" class="mr-2 text-grey-darken-3">mdi-magnify</v-icon>
            <input v-model="searchQuery" type="text" placeholder="Search..." class="search-input" />
          </div>
        </v-col>
      </v-row>

      <!-- Statistics Cards -->
      <v-row class="mb-10">
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
        <v-col cols="12">
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
                color="red-darken-2"
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
    </v-container>
  </v-main>
</template>

<style scoped>
/* Flat red background */
.app-background {
  background-color: #ff4d4d !important;
}

/* Search bar */
.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #000;
  border-radius: 50px;
  padding: 6px 14px;
  width: 380px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 16px;
  flex: 1;
  color: #333;
}

/* Active sidebar item */
.v-list-item.bg-red-lighten-5 {
  background-color: rgba(255, 205, 210, 0.3) !important;
  border-left: 4px solid #c62828 !important;
}
.v-field.v-field--outlined {
  border: 1px solid #ccc !important;
}
</style>
