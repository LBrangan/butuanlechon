<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'
import { useProducts } from '@/composables/useProducts'
import Chart from 'chart.js/auto'

const router = useRouter()
const authStore = useAuthUserStore()

const {
  products,
  lowStockProducts,
  currentSimulatedDate,
  todayReport,
  profitToday,
  todayProducts,
  setTodaySales,
  setBusinessDate,
  endDay,
  allReports,
} = useProducts()

// Local state
const lowStockDialog = ref(false)
const datePickerDialog = ref(false)
const endDayDialog = ref(false)
const tempDate = ref(null)
let chartInstance = null

// Computed
const totalProducts = computed(() => products.value.length)

const totalFinancial = computed(() => todayReport.value.sales + todayReport.value.expenses)

const stats = computed(() => [
  {
    title: 'Total Products',
    value: totalProducts.value,
    clickable: true,
    icon: 'mdi-package-variant',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'Low Stock Items',
    value: lowStockProducts.value.length,

    clickable: true,
    icon: 'mdi-alert-circle',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
])

const formattedDate = computed(() => {
  const date = new Date(currentSimulatedDate.value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Methods
const openLowStockDialog = () => {
  if (lowStockProducts.value.length > 0) {
    lowStockDialog.value = true
  }
}

const handleStatClick = (stat) => {
  if (stat.title === 'Total Products') {
    router.push('/daily-usage')
  } else if (stat.title === 'Low Stock Items') {
    router.push('/reports/stocks') // ← was: openLowStockDialog()
  }
}

const openDatePicker = () => {
  tempDate.value = new Date(currentSimulatedDate.value)
  datePickerDialog.value = true
}

const confirmDateChange = () => {
  if (tempDate.value) {
    let dateToUse = tempDate.value
    if (typeof dateToUse === 'string') {
      setBusinessDate(dateToUse)
    } else if (dateToUse instanceof Date) {
      const year = dateToUse.getFullYear()
      const month = String(dateToUse.getMonth() + 1).padStart(2, '0')
      const day = String(dateToUse.getDate()).padStart(2, '0')
      setBusinessDate(`${year}-${month}-${day}`)
    }
    datePickerDialog.value = false
  }
}

const handleSalesInput = (value) => {
  setTodaySales(Number(value) || 0)
}

const openEndDayDialog = () => {
  endDayDialog.value = true
}

const confirmEndDay = async () => {
  endDayDialog.value = false
  await endDay()
}

// Chart
const setupChart = () => {
  const ctx = document.getElementById('dailyChart')
  if (!ctx) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sales', 'Expenses', 'Profit'],
      datasets: [
        {
          label: 'Amount (₱)',
          data: [todayReport.value.sales, todayReport.value.expenses, profitToday.value],
          backgroundColor: [
            'rgba(46, 125, 50, 0.7)',
            'rgba(198, 40, 40, 0.7)',
            profitToday.value >= 0 ? 'rgba(0, 137, 123, 0.7)' : 'rgba(230, 81, 0, 0.7)',
          ],
          borderColor: [
            'rgba(46, 125, 50, 1)',
            'rgba(198, 40, 40, 1)',
            profitToday.value >= 0 ? 'rgba(0, 137, 123, 1)' : 'rgba(230, 81, 0, 1)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: (value) => '₱' + value.toLocaleString(),
            font: { size: 11 },
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 12, weight: '600' } },
        },
      },
    },
  })
}

watch(
  [todayReport, profitToday],
  () => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [
        todayReport.value.sales,
        todayReport.value.expenses,
        profitToday.value,
      ]
      chartInstance.data.datasets[0].backgroundColor[2] =
        profitToday.value >= 0 ? 'rgba(0, 137, 123, 0.7)' : 'rgba(230, 81, 0, 0.7)'
      chartInstance.data.datasets[0].borderColor[2] =
        profitToday.value >= 0 ? 'rgba(0, 137, 123, 1)' : 'rgba(230, 81, 0, 1)'
      chartInstance.update()
    }
  },
  { deep: true },
)

onMounted(() => {
  setTimeout(() => setupChart(), 100)
})

const handleLogout = () => router.push('/')
</script>

<template>
  <div class="dash-bg">
    <v-container fluid class="pa-6 pa-md-8">
      <!-- ── Top Bar ── -->
      <div class="top-bar mb-8">
        <div class="top-bar-left">
          <div class="top-bar-icon">
            <v-icon size="26" color="white">mdi-view-dashboard</v-icon>
          </div>
          <div>
            <p class="top-eyebrow">Inventory System</p>
            <h1 class="top-title">Dashboard</h1>
          </div>
        </div>
        <div class="top-bar-right">
          <div class="date-badge">
            <v-icon size="15" class="mr-1" style="color: #8b0000">mdi-calendar-today</v-icon>
            <span class="date-badge-text">{{ formattedDate }}</span>
            <v-btn
              size="x-small"
              variant="tonal"
              color="error"
              class="ml-3"
              rounded="lg"
              @click="openDatePicker"
            >
              <v-icon size="13" start>mdi-pencil</v-icon>Change
            </v-btn>
          </div>
        </div>
      </div>

      <!-- ── KPI Cards ── -->
      <v-row class="mb-6" dense>
        <v-col cols="12" sm="6" lg="3">
          <div
            class="kpi-card kpi-blue"
            @click="handleStatClick({ title: 'Total Products' })"
            style="cursor: pointer"
          >
            <div class="kpi-icon-wrap">
              <v-icon size="24" color="white">mdi-package-variant</v-icon>
            </div>
            <p class="kpi-label">Total Products</p>
            <p class="kpi-value">{{ totalProducts }}</p>
            <p class="kpi-sub">items in inventory</p>
          </div>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <div
            class="kpi-card kpi-red"
            @click="handleStatClick({ title: 'Low Stock Items' })"
            style="cursor: pointer"
          >
            <div class="kpi-icon-wrap">
              <v-icon size="24" color="white">mdi-alert-circle-outline</v-icon>
            </div>
            <p class="kpi-label">Low Stock Items</p>
            <p class="kpi-value">{{ lowStockProducts.length }}</p>
            <p class="kpi-sub">need restocking</p>
          </div>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <div class="kpi-card kpi-green">
            <div class="kpi-icon-wrap">
              <v-icon size="24" color="white">mdi-cash-multiple</v-icon>
            </div>
            <p class="kpi-label">Today's Sales</p>
            <p class="kpi-value">₱{{ todayReport.sales.toLocaleString() }}</p>
            <p class="kpi-sub">revenue today</p>
          </div>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <div class="kpi-card" :class="profitToday >= 0 ? 'kpi-teal' : 'kpi-orange'">
            <div class="kpi-icon-wrap">
              <v-icon size="24" color="white">{{
                profitToday >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
              }}</v-icon>
            </div>
            <p class="kpi-label">Net Profit</p>
            <p class="kpi-value">₱{{ profitToday.toLocaleString() }}</p>
            <p class="kpi-sub">{{ profitToday >= 0 ? 'profit today' : 'loss today' }}</p>
          </div>
        </v-col>
      </v-row>

      <!-- ── Main Grid ── -->
      <v-row dense>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Daily Sales Report -->
          <div class="section-card mb-5">
            <div class="section-card-header">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="#8b0000">mdi-chart-bar</v-icon>
                <span class="section-card-title">Daily Sales Report</span>
              </div>
              <span class="section-card-sub">{{ formattedDate }}</span>
            </div>
            <div class="section-card-body">
              <v-row dense>
                <v-col cols="12" md="4">
                  <div class="report-field-wrap">
                    <label class="report-field-label">
                      <v-icon size="14" color="success" class="mr-1">mdi-cash-register</v-icon>
                      Sales Today
                    </label>
                    <v-text-field
                      type="number"
                      prefix="₱"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      class="report-field"
                      :model-value="todayReport.sales"
                      @update:model-value="handleSalesInput"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="report-field-wrap">
                    <label class="report-field-label">
                      <v-icon size="14" color="error" class="mr-1">mdi-cart-outline</v-icon>
                      Expenses Today
                    </label>
                    <v-text-field
                      prefix="₱"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      class="report-field report-field--readonly"
                      :model-value="todayReport.expenses.toLocaleString()"
                      readonly
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="report-field-wrap">
                    <label class="report-field-label">
                      <v-icon size="14" :color="profitToday >= 0 ? 'teal' : 'orange'" class="mr-1"
                        >mdi-trending-up</v-icon
                      >
                      Net Profit
                    </label>
                    <v-text-field
                      prefix="₱"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      class="report-field"
                      :class="profitToday >= 0 ? 'report-field--profit' : 'report-field--loss'"
                      :model-value="profitToday.toLocaleString()"
                      readonly
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- Chart -->
          <div class="section-card mb-5">
            <div class="section-card-header">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="#8b0000">mdi-chart-areaspline</v-icon>
                <span class="section-card-title">Financial Overview — Today</span>
              </div>
            </div>
            <div class="section-card-body">
              <canvas id="dailyChart" height="110"></canvas>
            </div>
          </div>

          <!-- Products Purchased Today -->
          <div class="section-card" v-if="todayProducts.length > 0">
            <div class="section-card-header">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="#8b0000">mdi-shopping-outline</v-icon>
                <span class="section-card-title">Purchased Today</span>
              </div>
              <v-chip size="small" color="error" variant="tonal">{{ todayProducts.length }}</v-chip>
            </div>
            <div class="section-card-body pa-0">
              <div
                v-for="(product, i) in todayProducts"
                :key="product.id"
                class="today-product-row"
                :class="{ 'today-product-row--last': i === todayProducts.length - 1 }"
              >
                <div class="today-product-avatar">
                  {{ product.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-grow-1">
                  <p class="today-product-name">{{ product.name }}</p>
                  <p class="today-product-meta">{{ product.quantity }} {{ product.unit }}</p>
                </div>
                <span class="today-product-price">₱{{ product.totalPrice.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Expense Breakdown -->
          <div class="section-card mb-5">
            <div class="section-card-header">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="#8b0000">mdi-finance</v-icon>
                <span class="section-card-title">Expense Breakdown</span>
              </div>
            </div>
            <div class="section-card-body">
              <div class="breakdown-row">
                <div class="breakdown-dot" style="background: #2e7d32"></div>
                <span class="breakdown-label">Sales</span>
                <span class="breakdown-val">₱{{ todayReport.sales.toLocaleString() }}</span>
              </div>
              <div class="breakdown-bar mb-3">
                <div
                  class="breakdown-bar-fill breakdown-bar--green"
                  :style="{
                    width:
                      totalFinancial > 0 ? (todayReport.sales / totalFinancial) * 100 + '%' : '0%',
                  }"
                ></div>
              </div>
              <div class="breakdown-row">
                <div class="breakdown-dot" style="background: #c62828"></div>
                <span class="breakdown-label">Expenses</span>
                <span class="breakdown-val">₱{{ todayReport.expenses.toLocaleString() }}</span>
              </div>
              <div class="breakdown-bar mb-3">
                <div
                  class="breakdown-bar-fill breakdown-bar--red"
                  :style="{
                    width:
                      totalFinancial > 0
                        ? (todayReport.expenses / totalFinancial) * 100 + '%'
                        : '0%',
                  }"
                ></div>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="breakdown-row">
                <span class="breakdown-label font-weight-bold">Profit Margin</span>
                <span
                  class="breakdown-val font-weight-bold"
                  :style="{ color: profitToday >= 0 ? '#2e7d32' : '#c62828' }"
                >
                  {{
                    todayReport.sales > 0
                      ? ((profitToday / todayReport.sales) * 100).toFixed(1)
                      : 0
                  }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div class="section-card mb-5">
            <div class="section-card-header">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="error">mdi-alert-outline</v-icon>
                <span class="section-card-title">Low Stock Alerts</span>
              </div>
              <v-chip
                size="small"
                :color="lowStockProducts.length > 0 ? 'error' : 'success'"
                variant="tonal"
              >
                {{ lowStockProducts.length > 0 ? lowStockProducts.length + ' items' : 'All good' }}
              </v-chip>
            </div>
            <div class="section-card-body pa-0">
              <div v-if="lowStockProducts.length > 0">
                <div
                  v-for="(p, i) in lowStockProducts.slice(0, 5)"
                  :key="p.id"
                  class="low-stock-row"
                  :class="{
                    'low-stock-row--last':
                      i === Math.min(lowStockProducts.length, 5) - 1 &&
                      lowStockProducts.length <= 5,
                  }"
                >
                  <v-icon size="16" color="orange" class="mr-2">mdi-alert</v-icon>
                  <span class="low-stock-name">{{ p.name }}</span>
                  <v-chip size="x-small" color="error" variant="flat" class="ml-auto">
                    {{ p.quantity }} {{ p.unit }}
                  </v-chip>
                </div>
                <div class="px-4 pb-3 pt-1" v-if="lowStockProducts.length > 5">
                  <v-btn
                    size="small"
                    variant="text"
                    color="error"
                    block
                    @click="lowStockDialog = true"
                  >
                    +{{ lowStockProducts.length - 5 }} more
                  </v-btn>
                </div>
              </div>
              <div v-else class="pa-6 text-center">
                <v-icon size="36" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
                <p class="text-caption text-grey">All products have sufficient stock.</p>
              </div>
            </div>
          </div>

          <!-- End Day Card -->
          <div class="section-card end-day-card">
            <div class="section-card-body text-center">
              <v-icon size="40" color="#8b0000" class="mb-3">mdi-calendar-check</v-icon>
              <p class="end-day-title mb-1">End of Day</p>
              <p class="end-day-sub mb-4">
                Save today's report and advance to the next business day.
              </p>
              <v-btn
                color="error"
                variant="flat"
                rounded="lg"
                block
                class="end-day-btn"
                @click="openEndDayDialog"
              >
                <v-icon start>mdi-calendar-arrow-right</v-icon>
                End Day & Advance
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- ══════════ DIALOGS ══════════ -->

    <!-- Low Stock Dialog -->
    <v-dialog v-model="lowStockDialog" max-width="520px">
      <v-card rounded="xl" elevation="12" class="dlg-card">
        <div class="dlg-header px-6 py-5">
          <div class="d-flex align-center ga-3">
            <v-icon size="22" color="white">mdi-alert-circle</v-icon>
            <span class="dlg-title">Low Stock Products</span>
          </div>
        </div>
        <v-card-text class="px-6 py-4">
          <div v-if="lowStockProducts.length > 0">
            <div
              v-for="(product, i) in lowStockProducts"
              :key="product.id"
              class="low-stock-row"
              :class="{ 'low-stock-row--last': i === lowStockProducts.length - 1 }"
            >
              <div class="low-stock-avatar">
                {{ product.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-grow-1">
                <p class="low-stock-name mb-0">{{ product.name }}</p>
                <p class="text-caption text-grey mb-0">{{ product.unit }}</p>
              </div>
              <v-chip size="small" color="error" variant="flat">{{ product.quantity }} left</v-chip>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <v-icon size="40" color="success">mdi-check-circle-outline</v-icon>
            <p class="mt-2 text-grey">All products have sufficient stock.</p>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="error" rounded="lg" @click="lowStockDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Date Picker Dialog -->
    <v-dialog v-model="datePickerDialog" max-width="400px">
      <v-card rounded="xl" elevation="12" class="dlg-card">
        <div class="dlg-header px-6 py-5">
          <div class="d-flex align-center ga-3">
            <v-icon size="22" color="white">mdi-calendar-edit</v-icon>
            <span class="dlg-title">Change Business Date</span>
          </div>
        </div>
        <v-card-text class="pa-4">
          <v-date-picker
            v-model="tempDate"
            color="red-darken-2"
            show-adjacent-months
            elevation="0"
          />
        </v-card-text>
        <v-card-actions class="px-6 pb-5 d-flex ga-3 justify-end">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="dlg-cancel-btn"
            @click="datePickerDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            variant="flat"
            color="error"
            rounded="lg"
            class="font-weight-bold"
            @click="confirmDateChange"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- End Day Dialog -->
    <v-dialog v-model="endDayDialog" max-width="440px">
      <v-card rounded="xl" elevation="12" class="dlg-card">
        <v-card-text class="px-8 pt-10 pb-6 text-center">
          <div class="end-icon-wrap mb-4">
            <v-icon size="36" color="#8b0000">mdi-calendar-check</v-icon>
          </div>
          <p class="end-dlg-title mb-2">End Today's Business Day?</p>
          <p class="text-body-2 text-grey mb-4">
            This will save today's report and advance the business date.
          </p>
          <div class="end-summary">
            <div class="end-summary-row">
              <span>Sales</span>
              <strong>₱{{ todayReport.sales.toLocaleString() }}</strong>
            </div>
            <div class="end-summary-row">
              <span>Expenses</span>
              <strong>₱{{ todayReport.expenses.toLocaleString() }}</strong>
            </div>
            <div class="end-summary-row">
              <span>Net Profit</span>
              <strong :style="{ color: profitToday >= 0 ? '#2e7d32' : '#c62828' }">
                ₱{{ profitToday.toLocaleString() }}
              </strong>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-8 pb-8 d-flex ga-3 justify-center">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="dlg-cancel-btn"
            style="min-width: 120px"
            @click="endDayDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            variant="flat"
            color="error"
            rounded="lg"
            style="min-width: 120px"
            class="font-weight-bold"
            @click="confirmEndDay"
          >
            <v-icon start size="16">mdi-check</v-icon>
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.dash-bg {
  background: #f4f5f7;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Top Bar ── */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: linear-gradient(120deg, #7b0000 0%, #b71c1c 60%, #c62828 100%);
  border-radius: 16px;
  padding: 20px 28px;
  box-shadow: 0 4px 24px rgba(139, 0, 0, 0.2);
}
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.top-bar-icon {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.top-eyebrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
}
.top-title {
  color: #fff;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.3px;
}
.date-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.date-badge-text {
  font-size: 0.82rem;
  font-weight: 600;
  color: #333;
}

/* ── KPI Cards ── */
.kpi-card {
  border-radius: 14px;
  padding: 20px 22px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
}
.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.16);
}
.kpi-card::after {
  content: '';
  position: absolute;
  right: -20px;
  top: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}
.kpi-blue {
  background: linear-gradient(135deg, #1565c0, #1976d2);
}
.kpi-red {
  background: linear-gradient(135deg, #7b0000, #c62828);
}
.kpi-green {
  background: linear-gradient(135deg, #1b5e20, #388e3c);
}
.kpi-teal {
  background: linear-gradient(135deg, #00695c, #00897b);
}
.kpi-orange {
  background: linear-gradient(135deg, #e65100, #f57c00);
}
.kpi-icon-wrap {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.kpi-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.8;
  margin: 0 0 4px;
}
.kpi-value {
  font-size: 1.7rem;
  font-weight: 800;
  margin: 0 0 2px;
  line-height: 1;
}
.kpi-sub {
  font-size: 0.72rem;
  opacity: 0.7;
  margin: 0;
}

/* ── Section Cards ── */
.section-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.section-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}
.section-card-sub {
  font-size: 0.75rem;
  color: #888;
}
.section-card-body {
  padding: 20px;
}

/* ── Report Fields ── */
.report-field-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.report-field-label {
  font-size: 0.73rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}
.report-field :deep(.v-field) {
  border-radius: 10px;
}
.report-field--readonly :deep(.v-field) {
  background: #fafafa;
}
.report-field--profit :deep(.v-field input) {
  color: #2e7d32;
  font-weight: 700;
}
.report-field--loss :deep(.v-field input) {
  color: #c62828;
  font-weight: 700;
}

/* ── Today Products ── */
.today-product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}
.today-product-row:hover {
  background: #fdf5f5;
}
.today-product-row--last {
  border-bottom: none;
}
.today-product-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #8b0000, #c62828);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.today-product-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.today-product-meta {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}
.today-product-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #8b0000;
  white-space: nowrap;
}

/* ── Breakdown ── */
.breakdown-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.breakdown-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.breakdown-label {
  font-size: 0.82rem;
  color: #555;
  flex: 1;
}
.breakdown-val {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a1a1a;
}
.breakdown-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 99px;
  overflow: hidden;
}
.breakdown-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}
.breakdown-bar--green {
  background: linear-gradient(90deg, #2e7d32, #66bb6a);
}
.breakdown-bar--red {
  background: linear-gradient(90deg, #8b0000, #ef5350);
}

/* ── Low Stock ── */
.low-stock-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}
.low-stock-row:hover {
  background: #fff9f9;
}
.low-stock-row--last {
  border-bottom: none;
}
.low-stock-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e53935, #ef9a9a);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.low-stock-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* ── End Day Card ── */
.end-day-card {
  border: 2px dashed #ffcdd2;
  background: #fff9f9;
}
.end-day-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.end-day-sub {
  font-size: 0.8rem;
  color: #888;
}
.end-day-btn {
  font-weight: 700 !important;
  text-transform: none !important;
}

/* ── End Day Dialog ── */
.end-icon-wrap {
  width: 70px;
  height: 70px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid #ffcdd2;
}
.end-dlg-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a1a1a;
}
.end-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid #eee;
}
.end-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  color: #444;
}
.end-summary-row:last-child {
  border-bottom: none;
}

/* ── Dialogs ── */
.dlg-card {
  border: 1px solid rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.dlg-header {
  background: linear-gradient(120deg, #7b0000, #c62828);
}
.dlg-title {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
}
.dlg-cancel-btn {
  color: #555 !important;
  border-color: #ddd !important;
  text-transform: none !important;
  font-weight: 600 !important;
}
</style>
