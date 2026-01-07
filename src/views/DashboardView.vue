<script setup>
import { useRouter } from 'vue-router'
import {ref} from 'vue'
import NavigationDrawer from '@/components/layout/navigation/Navigation.vue'

const searchQuery = ref('')
const router = useRouter()

const stats = ref([
  { title: 'Total Products', value: 1200, icon: 'mdi-package-variant', gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)' },
  { title: 'Low Stock Items', value: 45, icon: 'mdi-alert-circle-outline', gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)' },
  { title: 'Total Revenue', value: 15000, icon: 'mdi-currency-usd', gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)' },
  { title: 'Orders Today', value: 8, icon: 'mdi-eye-outline', gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)' },
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
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <v-container class="pa-8">
      <!-- Header -->
      <div class="align-items-lg-center">
        <h1 class="dashboard-title mb-8">Dashboard</h1>

        <!-- Statistics Cards -->
        <v-row class="mb-6 stats-container pa-8 rounded-xl">
          <v-col cols="12" md="6" lg="6" v-for="stat in stats.slice(0, 2)" :key="stat.title">
            <v-card class="stat-card pa-8 rounded-xl" elevation="4" height="180">
              <div class="d-flex justify-space-between align-center h-100">
                <div class="d-flex flex-column justify-center">
                  <h2 class="text-h3 font-weight-bold stat-value mb-3">
                    {{ stat.value.toLocaleString() }}
                  </h2>
                  <p class="text-h6 stat-label mb-0 font-weight-medium">{{ stat.title }}</p>
                </div>
                <div class="stat-icon-wrapper" :style="{ background: stat.gradient }">
                  <v-icon size="40" color="white">
                    {{ stat.icon }}
                  </v-icon>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activities -->
        <v-row>
          <v-col cols="12" class="activities-container pa-8 rounded-xl">
            <v-card class="activities-card pa-10 rounded-xl" elevation="4" min-height="500">
              <h2 class="text-h4 font-weight-bold activities-title mb-6">Recent Activities</h2>
              <v-divider class="activities-divider mb-12"></v-divider>
              <div class="text-center py-16">
                <div class="empty-state-icon mb-8">
                  <v-icon size="120" class="text-grey-lighten-1">mdi-clipboard-list-outline</v-icon>
                </div>
                <p class="text-h5 empty-state-text mb-10 font-weight-regular">
                  No activities yet. Start by adding products!
                </p>
                <v-btn
                  class="add-product-btn px-10 py-6 text-body-1 font-weight-bold"
                  size="x-large"
                  rounded="xl"
                  elevation="6"
                  @click="addProduct"
                >
                  <v-icon start size="24">mdi-plus-circle</v-icon>
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
.app-background {
  background: linear-gradient(135deg, #FFF5F5 0%, #FFE4E1 100%);
  min-height: 100vh;
}

.dashboard-title {
  color: #8B0000;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(139, 0, 0, 0.1);
}

.stats-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.2);
}

.stat-card {
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(139, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(139, 0, 0, 0.25) !important;
}

.stat-value {
  color: #8B0000;
  font-size: 2.5rem;
}

.stat-label {
  color: #666;
  font-size: 1.1rem;
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(139, 0, 0, 0.3);
}

.activities-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.2);
}

.activities-card {
  background: white;
  border: 1px solid rgba(139, 0, 0, 0.1);
}

.activities-title {
  color: #8B0000;
  letter-spacing: -0.3px;
}

.activities-divider {
  border-color: rgba(139, 0, 0, 0.2);
  border-width: 2px;
}

.empty-state-icon {
  background: linear-gradient(135deg, #FFE4E1 0%, #FFF5F5 100%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(139, 0, 0, 0.1);
}

.empty-state-text {
  color: #666;
  font-size: 1.25rem;
  line-height: 1.6;
}

.add-product-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%) !important;
  color: white !important;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(139, 0, 0, 0.3) !important;
}

.add-product-btn:hover {
  background: linear-gradient(135deg, #B22222 0%, #DC143C 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(139, 0, 0, 0.4) !important;
}

.v-field.v-field--outlined {
  border: 2px solid rgba(139, 0, 0, 0.2) !important;
  transition: all 0.3s ease;
}

.v-field.v-field--outlined:hover {
  border-color: #B22222 !important;
}

.v-field.v-field--outlined:focus-within {
  border-color: #8B0000 !important;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}
</style>
