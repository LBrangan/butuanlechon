import { ref, computed } from 'vue'

/* ================= GLOBAL STATE ================= */

const products = ref([])
let nextId = 1

// date helper
const todayKey = () => new Date().toISOString().split('T')[0]

// daily reports
const dailyReports = ref({})
// structure:
// {
//   "2026-01-12": {
//     sales: 0,
//     expenses: 0
//   }
// }

const getTodayReport = () => {
  const date = todayKey()
  if (!dailyReports.value[date]) {
    dailyReports.value[date] = {
      sales: 0,
      expenses: 0,
    }
  }
  return dailyReports.value[date]
}

/* ================= COMPUTED ================= */

const lowStockProducts = computed(() => products.value.filter((p) => p.quantity <= 10))

const todayReport = computed(() => getTodayReport())

const profitToday = computed(() => todayReport.value.sales - todayReport.value.expenses)

/* ================= COMPOSABLE ================= */

export function useProducts() {
  /* ===== PRODUCTS ===== */

  const addProduct = (product) => {
    products.value.push({
      ...product,
      id: nextId++,
    })
  }

  const updateProduct = (updated) => {
    const index = products.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) products.value[index] = updated
  }

  const deleteProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id)
  }

  /* ===== DEDUCT / EXPENSES ===== */

  const deductProduct = (productId, qty) => {
    const product = products.value.find((p) => p.id === productId)
    if (!product || qty <= 0) return

    product.quantity -= qty

    const report = getTodayReport()
    report.expenses += qty * product.price
  }

  const deductMultipleProducts = (usageArray) => {
    const report = getTodayReport()

    usageArray.forEach((u) => {
      const product = products.value.find((p) => p.id === u.productId)
      if (!product || u.quantity <= 0) return

      product.quantity -= u.quantity
      report.expenses += u.quantity * product.price
    })
  }

  /* ===== SALES ===== */

  const setTodaySales = (amount) => {
    const report = getTodayReport()
    report.sales = Number(amount) || 0
  }

  /* ===== END DAY / REPORTS ===== */

  const endDay = () => {
    const today = todayKey()

    // ensure report exists
    getTodayReport()

    // nothing to do actually because reports are already stored by date
    // this function is for semantic clarity & future use
    console.log('Day ended:', today)
  }

  const allReports = computed(() => {
    return Object.entries(dailyReports.value).map(([date, data]) => ({
      date,
      sales: data.sales,
      expenses: data.expenses,
      profit: data.sales - data.expenses,
    }))
  })

  return {
    // state
    products,
    lowStockProducts,

    // product actions
    addProduct,
    updateProduct,
    deleteProduct,

    // deduct
    deductProduct,
    deductMultipleProducts,

    // reports
    todayReport,
    profitToday,
    setTodaySales,
    dailyReports,
    allReports,
    endDay,
  }
}
