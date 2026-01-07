<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/layout/navigation/Navigation.vue'
import { useProducts } from '@/composables/useProducts'

// Router
const router = useRouter()

// Products composable
const { products } = useProducts()

// Computed: total products
const totalProducts = computed(() => products.value.length)

// Dashboard stats
const stats = computed(() => [
  {
    title: 'Total Products',
    value: totalProducts.value,
    icon: 'mdi-package-variant',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)'
  },
  {
    title: 'Low Stock Items',
    value: 45,
    icon: 'mdi-alert-circle-outline',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)'
  },
  {
    title: 'Total Revenue',
    value: 15000,
    icon: 'mdi-currency-usd',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)'
  },
  {
    title: 'Orders Today',
    value: 8,
    icon: 'mdi-eye-outline',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)'
  },
])

// Navigate to products page
const addProduct = () => router.push('/products')

// Logout
const handleLogout = () => router.push('/')
</script>

<template>
  <v-main class="app-background">
    <NavigationDrawer @logout="handleLogout" />

    <v-container class="pa-8">
      <h1 class="dashboard-title mb-8">Dashboard</h1>

      <!-- Statistics Cards -->
      <v-row class="mb-6 stats-container pa-8 rounded-xl">
        <v-col
          cols="12"
          md="6"
          lg="6"
          v-for="stat in stats.slice(0, 2)"
          :key="stat.title"
        >
          <v-card class="stat-card pa-8 rounded-xl" elevation="4" height="180">
            <div class="d-flex justify-space-between align-center h-100">
              <div>
                <h2 class="text-h3 font-weight-bold stat-value mb-3">
                  {{ stat.value.toLocaleString() }}
                </h2>
                <p class="text-h6 stat-label mb-0">
                  {{ stat.title }}
                </p>
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
            <h2 class="text-h4 font-weight-bold activities-title mb-6">
              Recent Activities
            </h2>

            <v-divider class="activities-divider mb-12" />

            <div class="text-center py-16">
              <v-icon size="120" class="mb-8 text-grey-lighten-1">
                mdi-clipboard-list-outline
              </v-icon>

              <p class="text-h5 empty-state-text mb-10">
                No activities yet. Start by adding products!
              </p>

              <v-btn
                class="add-product-btn px-10 py-6 font-weight-bold"
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
}
.stats-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
}
.stat-card {
  background: white;
}
.stat-value {
  color: #8B0000;
}
.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
}
.activities-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
}
.activities-card {
  background: white;
}
.add-product-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%) !important;
  color: white !important;
}
</style>
