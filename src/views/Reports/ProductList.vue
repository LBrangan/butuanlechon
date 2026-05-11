<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/products/index.js'

const router = useRouter()
const { products } = useProducts()

// ── Group products by month, then by date ──
const groupedByMonth = computed(() => {
  const monthMap = {}

  products.value.forEach((p) => {
    const date = p.purchaseDate || 'Unknown'
    const month = date.length >= 7 ? date.slice(0, 7) : 'Unknown'

    if (!monthMap[month]) monthMap[month] = {}
    if (!monthMap[month][date]) monthMap[month][date] = []
    monthMap[month][date].push(p)
  })

  // Sort months descending, dates descending
  return Object.entries(monthMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, dates]) => ({
      month,
      monthLabel: formatMonth(month),
      totalExpenses: Object.values(dates)
        .flat()
        .reduce((s, p) => s + p.totalPrice, 0),
      totalItems: Object.values(dates).flat().length,
      dates: Object.entries(dates)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, items]) => ({
          date,
          dateLabel: formatDate(date),
          items,
          totalExpenses: items.reduce((s, p) => s + p.totalPrice, 0),
        })),
    }))
})

// ── Expanded state ──
const expandedMonths = ref({})
const expandedDates = ref({})

const toggleMonth = (month) => {
  expandedMonths.value[month] = !expandedMonths.value[month]
  // Close all dates under this month when collapsing
  if (!expandedMonths.value[month]) {
    groupedByMonth.value
      .find((m) => m.month === month)
      ?.dates.forEach((d) => {
        expandedDates.value[d.date] = false
      })
  }
}

const toggleDate = (date) => {
  expandedDates.value[date] = !expandedDates.value[date]
}

// ── Helpers ──
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatMonth = (m) => {
  const [year, month] = m.split('-')
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const profitColor = (val) => (val >= 0 ? '#2e7d32' : '#c62828')
</script>

<template>
  <div class="pl-bg">
    <v-container fluid class="pa-4 pa-md-8">
      <!-- ── Top Bar ── -->
      <div class="top-bar mb-8">
        <div class="top-bar-left">
          <v-btn icon variant="text" class="back-btn mr-2" @click="router.back()">
            <v-icon color="white" size="20">mdi-arrow-left</v-icon>
          </v-btn>
          <div class="top-bar-icon">
            <v-icon size="26" color="white">mdi-package-variant</v-icon>
          </div>
          <div>
            <p class="top-eyebrow">Inventory System</p>
            <h1 class="top-title">Product History</h1>
          </div>
        </div>
        <div class="date-badge">
          <v-icon size="14" class="mr-1" style="color: #8b0000">mdi-package-variant-closed</v-icon>
          <span class="date-badge-text"
            >{{ products.length }} product{{ products.length !== 1 ? 's' : '' }} total</span
          >
        </div>
      </div>

      <!-- ── Empty State ── -->
      <div v-if="groupedByMonth.length === 0" class="empty-state">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-package-variant-closed</v-icon>
        <p class="empty-title">No products yet</p>
        <p class="empty-sub">Add products from the inventory page to see them here.</p>
      </div>

      <!-- ── Month Groups ── -->
      <div v-for="monthGroup in groupedByMonth" :key="monthGroup.month" class="month-block mb-4">
        <!-- Month Header -->
        <div class="month-header" @click="toggleMonth(monthGroup.month)">
          <div class="d-flex align-center ga-3">
            <div class="month-icon">
              <v-icon size="18" color="white">mdi-calendar-month</v-icon>
            </div>
            <div>
              <p class="month-label">{{ monthGroup.monthLabel }}</p>
              <p class="month-meta">
                {{ monthGroup.totalItems }} item{{ monthGroup.totalItems !== 1 ? 's' : '' }} · ₱{{
                  monthGroup.totalExpenses.toLocaleString()
                }}
                total
              </p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <v-chip
              size="small"
              color="white"
              variant="tonal"
              style="color: white; font-weight: 700"
            >
              {{ monthGroup.dates.length }} day{{ monthGroup.dates.length !== 1 ? 's' : '' }}
            </v-chip>
            <v-icon
              color="white"
              size="20"
              :style="{
                transform: expandedMonths[monthGroup.month] ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.25s',
              }"
            >
              mdi-chevron-down
            </v-icon>
          </div>
        </div>

        <!-- Date Groups inside Month -->
        <div v-if="expandedMonths[monthGroup.month]" class="dates-wrap">
          <div v-for="dateGroup in monthGroup.dates" :key="dateGroup.date" class="date-block">
            <!-- Date Row -->
            <div class="date-row" @click="toggleDate(dateGroup.date)">
              <div class="d-flex align-center ga-3">
                <div class="date-icon">
                  <v-icon size="15" color="#8b0000">mdi-calendar</v-icon>
                </div>
                <div>
                  <p class="date-label">{{ dateGroup.dateLabel }}</p>
                  <p class="date-meta">
                    {{ dateGroup.items.length }} product{{
                      dateGroup.items.length !== 1 ? 's' : ''
                    }}
                    added
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <span class="date-total">₱{{ dateGroup.totalExpenses.toLocaleString() }}</span>
                <v-icon
                  size="18"
                  color="#aaa"
                  :style="{
                    transform: expandedDates[dateGroup.date] ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.25s',
                  }"
                >
                  mdi-chevron-down
                </v-icon>
              </div>
            </div>

            <!-- Products Table for that date -->
            <div v-if="expandedDates[dateGroup.date]" class="products-table-wrap">
              <v-table class="products-table" hover>
                <thead>
                  <tr>
                    <th class="th-cell">#</th>
                    <th class="th-cell">Product Name</th>
                    <th class="th-cell">Quantity</th>
                    <th class="th-cell">Unit</th>
                    <th class="th-cell">Price/Unit</th>
                    <th class="th-cell">Total Value</th>
                    <th class="th-cell">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in dateGroup.items" :key="item.id" class="td-row">
                    <td class="td-cell">
                      <span class="rank">{{ i + 1 }}</span>
                    </td>
                    <td class="td-cell">
                      <div class="d-flex align-center ga-2">
                        <div class="product-avatar">{{ item.name.charAt(0).toUpperCase() }}</div>
                        <span class="product-name">{{ item.name }}</span>
                      </div>
                    </td>
                    <td class="td-cell">
                      <span class="qty-badge">{{ item.quantity }}</span>
                    </td>
                    <td class="td-cell">
                      <span class="unit-text">{{ item.unit }}</span>
                    </td>
                    <td class="td-cell">
                      <span class="val-green">₱{{ item.price.toLocaleString() }}</span>
                    </td>
                    <td class="td-cell">
                      <span class="val-red font-weight-bold"
                        >₱{{ item.totalPrice.toLocaleString() }}</span
                      >
                    </td>
                    <td class="td-cell">
                      <v-chip
                        v-if="item.expiryDate"
                        size="x-small"
                        :color="new Date(item.expiryDate) < new Date() ? 'error' : 'success'"
                        variant="tonal"
                      >
                        {{ formatDate(item.expiryDate) }}
                      </v-chip>
                      <span v-else class="text-grey text-caption">—</span>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Date subtotal -->
              <div class="date-subtotal">
                <span class="subtotal-label">Total Expenses for {{ dateGroup.dateLabel }}</span>
                <span class="subtotal-val">₱{{ dateGroup.totalExpenses.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.pl-bg {
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
.back-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 10px !important;
  width: 36px !important;
  height: 36px !important;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
}
.top-bar-icon {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* ── Empty ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #555;
  margin: 0 0 6px;
}
.empty-sub {
  font-size: 0.82rem;
  color: #aaa;
  margin: 0;
}

/* ── Month Block ── */
.month-block {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(120deg, #7b0000, #c62828);
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s;
}
.month-header:hover {
  opacity: 0.92;
}
.month-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.month-label {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}
.month-meta {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* ── Dates Wrap ── */
.dates-wrap {
  background: #fff;
}
.date-block {
  border-bottom: 1px solid #f5f5f5;
}
.date-block:last-child {
  border-bottom: none;
}

.date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
}
.date-row:hover {
  background: #fdf5f5;
}
.date-icon {
  width: 30px;
  height: 30px;
  background: #fff5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #ffcdd2;
}
.date-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}
.date-meta {
  font-size: 0.72rem;
  color: #aaa;
  margin: 0;
}
.date-total {
  font-size: 0.92rem;
  font-weight: 800;
  color: #c62828;
}

/* ── Products Table ── */
.products-table-wrap {
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}
.products-table {
  width: 100%;
}
.th-cell {
  background: #f5f5f5 !important;
  color: #555 !important;
  font-size: 0.71rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.8px !important;
  text-transform: uppercase !important;
  padding: 11px 16px !important;
  border-bottom: 2px solid #eeeeee !important;
  white-space: nowrap;
}
.td-row {
  transition: background 0.15s;
}
.td-row:hover {
  background: #fff5f5 !important;
}
.td-row:not(:last-child) td {
  border-bottom: 1px solid #f8f8f8;
}
.td-cell {
  padding: 11px 16px !important;
  vertical-align: middle;
}

.rank {
  font-size: 0.75rem;
  font-weight: 800;
  color: #bbb;
}
.product-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b0000, #c62828);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.product-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
}
.qty-badge {
  display: inline-flex;
  align-items: center;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 2px 10px;
  border-radius: 6px;
}
.unit-text {
  font-size: 0.82rem;
  color: #888;
}
.val-green {
  font-weight: 700;
  color: #2e7d32;
  font-size: 0.88rem;
}
.val-red {
  font-weight: 700;
  color: #c62828;
  font-size: 0.88rem;
}

/* ── Subtotal ── */
.date-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff5f5;
  border-top: 2px solid #ffcdd2;
}
.subtotal-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #888;
}
.subtotal-val {
  font-size: 1rem;
  font-weight: 800;
  color: #c62828;
}
</style>
