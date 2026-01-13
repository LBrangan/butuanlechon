<script setup>
import { watch } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationDrawer from '@/components/layout/navigation/Navigation.vue'
import Chart from 'chart.js/auto'
import { useProducts } from '@/composables/useProducts.js'

// router
const router = useRouter()

// products composable (ISA LANG)
const { products, lowStockProducts, todayReport, profitToday, setTodaySales } = useProducts()

// computed
const totalProducts = computed(() => products.value.length)

const { endDay } = useProducts()

const endToday = () => {
  endDay()
  alert('Day ended successfully!')
}

// auto update chart when values change
watch([todayReport, profitToday], () => {
  if (!chartInstance) return

  chartInstance.data.datasets[0].data = [
    todayReport.value.expenses,
    todayReport.value.sales,
    profitToday.value,
  ]
  chartInstance.update()
})

// dashboard stats
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

// low stock dialog
const lowStockDialog = ref(false)

const openLowStockDialog = () => {
  if (lowStockProducts.value.length > 0) {
    lowStockDialog.value = true
  }
}

const handleLogout = () => router.push('/')

// =====================
// CHART
// =====================
let chartInstance = null

onMounted(() => {
  const ctx = document.getElementById('dailyChart')

  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Expenses', 'Sales', 'Profit'],
      datasets: [
        {
          label: 'Today',
          data: [todayReport.value.expenses, todayReport.value.sales, profitToday.value],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  })
})
</script>

<template>
  <v-main class="app-background">
    <NavigationDrawer @logout="handleLogout" />

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
        <h2 class="mb-4">Daily Sales Report</h2>

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

      <v-btn class="mt-4" color="red-darken-2" variant="elevated" @click="endToday">
        End Day
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
  </v-main>
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
