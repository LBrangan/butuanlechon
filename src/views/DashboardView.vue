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


      <!-- DAILY SALES REPORT -->
          <!--Dire butuang daily sales shet-->



      <v-btn class="mt-4" color="red-darken-2" variant="elevated" size="large" @click="endToday">
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
