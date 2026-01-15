<script setup>
import { watch } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'
import AppLayout from '@/components/layout/AppLayout.vue'


const router = useRouter()

const authStore = useAuthUserStore()

// State variables
const products = ref([])
const lowStockProducts = ref([])
const todayReport = ref({ sales: 0, expenses: 0 })
const currentSimulatedDate = ref(new Date().toLocaleDateString())

// Computed: total products
const totalProducts = computed(() => products.value.length)

// Computed: profit today
const profitToday = computed(() => todayReport.value.sales - todayReport.value.expenses)

const stats = computed(() => [
  {
    title: 'Total Products',
    value: totalProducts.value,
    clickable: false,
  },
  {
    title: 'Low Stock Items',
    value: lowStockProducts.value.length,
    clickable: true,
  },
])

const lowStockDialog = ref(false)

const openLowStockDialog = () => {
  if (lowStockProducts.value.length > 0) {
    lowStockDialog.value = true
  }
}

// Set today's sales
const setTodaySales = (value) => {
  todayReport.value.sales = value
}

// End day and advance to next
const endToday = () => {
  // Reset for next day
  todayReport.value = { sales: 0, expenses: 0 }
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + 1)
  currentSimulatedDate.value = nextDate.toLocaleDateString()
}

const handleLogout = () => router.push('/')



</script>

<template>
  <AppLayout>
    <template #content>
      <div class="app-background">
        <v-container class="pa-8">
          <h1 class="dashboard-title mb-8">Dashboard</h1>

          <!-- Statistics Cards -->


      <!-- DAILY SALES REPORT -->




      <v-btn class="mt-4" color="red-darken-2" variant="elevated" size="large" @click="endToday">
        <v-icon start>mdi-calendar-check</v-icon>
        End Day & Advance to Next
      </v-btn>

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
  background: linear-gradient(135deg, #fff5f5 0%, #ffe4e1 100%);
  min-height: 100vh;
}
.dashboard-title {
  color: #8b0000;
  font-size: 2.5rem;
  font-weight: 700;
}
.stats-container {
  background: linear-gradient(135deg, #8b0000 0%, #b22222 100%);
}
.stat-card {
  background: white;
}
.stat-value {
  color: #8b0000;
}
.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
}
</style>
