<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts.js'
import { useAuthUserStore } from '@/stores/authUser'
import AppLayout from '@/components/layout/AppLayout.vue'


const { products, lowStockProducts } = useProducts()

// Router
const router = useRouter()

const authStore = useAuthUserStore()

// Computed: total products
const totalProducts = computed(() => products.value.length)

// Dashboard stats
const stats = computed(() => [
  {
    title: 'Total Products',
    value: totalProducts.value,
    icon: 'mdi-package-variant',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)',
    clickable: false
  },
  {
    title: 'Low Stock Items',
    value: lowStockProducts.value.length,
    icon: 'mdi-alert-circle-outline',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)',
    clickable: true
  },
  {
    title: 'Total Revenue',
    value: 15000,
    icon: 'mdi-currency-usd',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)',
    clickable: false
  },
  {
    title: 'Orders Today',
    value: 8,
    icon: 'mdi-eye-outline',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)',
    clickable: false
  },
])

// Navigate to products page or low stock dialog
const addProduct = () => router.push('/products')
const handleLogout = () => router.push('/')

// Low Stock dialog
const lowStockDialog = ref(false)

const openLowStockDialog = () => {
  if (lowStockProducts.value.length > 0) {
    lowStockDialog.value = true
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="app-background">
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
          <v-card
            class="stat-card pa-8 rounded-xl"
            elevation="4"
            height="180"
            :style="{ cursor: stat.clickable ? 'pointer' : 'default' }"
            @click="stat.clickable ? openLowStockDialog() : null"
          >
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
                <v-icon size="80" color="white">
                  {{ stat.icon }}
                </v-icon>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Low Stock Dialog -->
      <v-dialog v-model="lowStockDialog" max-width="600px">
        <v-card>
          <v-card-title class="text-h6">Low Stock Products</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item v-for="product in lowStockProducts" :key="product.id">
                <v-list-item-content>
                  <v-list-item-title>{{ product.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Qty: {{ product.quantity }} {{ product.unit }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p v-if="lowStockProducts.length === 0">All products have sufficient stock.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="lowStockDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </v-container>
      </div>
    </template>
  </AppLayout>
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
</style>
