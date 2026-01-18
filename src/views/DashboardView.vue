<script setup>
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
          <v-row class="mb-6 stats-container pa-8 rounded-xl">
            <v-col cols="12" md="6" lg="6" v-for="stat in stats.slice(0, 2)" :key="stat.title">
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
                    <v-icon size="40" color="white">
                      {{ stat.icon }}
                    </v-icon>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <!-- DAILY SALES REPORT -->
          <v-card class="pa-6 mt-8 rounded-xl" elevation="4">
            <h2 class="mb-4">Daily Sales Report - {{ currentSimulatedDate }}</h2>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Sales Today"
                  type="number"
                  prefix="₱"
                  variant="outlined"
                  :model-value="todayReport.sales"
                  @update:model-value="setTodaySales"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  label="Expenses Today"
                  prefix="₱"
                  variant="outlined"
                  :model-value="todayReport.expenses"
                  readonly
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  label="Profit Today"
                  prefix="₱"
                  variant="outlined"
                  :model-value="profitToday"
                  readonly
                  :color="profitToday >= 0 ? 'green' : 'red'"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card class="pa-6 mt-8 rounded-xl" elevation="4">
            <h2 class="mb-4">Profit vs Expenses (Today)</h2>
            <canvas id="dailyChart" height="120"></canvas>
          </v-card>

          <v-btn
            class="mt-4"
            color="red-darken-2"
            variant="elevated"
            size="large"
            @click="endToday"
          >
            <v-icon start>mdi-calendar-check</v-icon>
            End Day & Advance to Next
          </v-btn>

          <!-- Low Stock Dialog -->
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
