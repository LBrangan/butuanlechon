<script setup>
import { useRouter } from 'vue-router'
import {ref} from 'vue'

const drawer = ref(true)
const searchQuery = ref('')
const router = useRouter()
const menuItems = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard', active: true },
  { title: 'Products', icon: 'mdi-package-variant', active: false },
])
const stats = ref([
  { title: 'Total Products', value: 1200, icon: 'mdi-package-variant' },
  { title: 'Low Stock Items', value: 45, icon: 'mdi-alert-circle-outline' },
  { title: 'Total Revenue', value: 15000, icon: 'mdi-currency-usd' },
  { title: 'Orders Today', value: 8, icon: 'mdi-eye-outline' },
])

const setActiveItem = (title) => {
  menuItems.value.forEach(item => {
    item.active = (item.title === title)
  })
  if (title ==='Dashboard'){
  router.push('/dashboard')
  } else if (title === 'Products'){
  router.push('/product')
  }
}

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
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" permanent width="280" class="elevation-2" color="white">
      <!-- Logo Section -->
      <v-list-item class="px-6 py-6">
        <template v-slot:prepend>
          <v-icon color="red darken-2" size="40" class="mr-3"> mdi-silverware-fork-knife </v-icon>
        </template>
        <v-list-item-title>
          <div>
            <div class="text-h5 font-weight-bold text-red-darken-2">BL & SG</div>
            <div class="text-body-1 text-grey-darken-1">Restaurant</div>
            <div class="text-body-2 text-grey">Inventory System</div>
          </div>
        </v-list-item-title>
      </v-list-item>

      <v-divider class="mx-4"></v-divider>

      <!-- Navigation Menu -->
      <v-list nav density="compact" class="pt-6">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :class="{ 'bg-red-lighten-5': item.active }"
          class="mb-2 mx-4 rounded-lg"
          @click="setActiveItem(item.title)"
        >
          <template v-slot:prepend>
            <v-icon :color="item.active ? 'red-darken-2' : 'grey-darken-1'" size="24" class="mr-3">
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            :class="item.active ? 'text-red-darken-2 font-weight-medium' : 'text-grey-darken-1'"
            class="text-body-1"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- User Profile and Logout -->
      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-4"></v-divider>
          <v-list>
            <v-list-item class="px-4">
              <template v-slot:prepend>
                <v-avatar color="red-lighten-2" size="40">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-1 font-weight-medium">Admin</v-list-item-title>
              <template v-slot:append>
                <v-btn
                  icon="mdi-logout"
                  variant="text"
                  color="red-darken-2"
                  @click="handleLogout"
                  size="small"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>

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
