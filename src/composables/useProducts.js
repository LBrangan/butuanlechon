import { ref, computed } from 'vue'

/* ================= GLOBAL STATE ================= */

const products = ref([])
let nextId = 1

// SIMULATED DATE - para testable ang end of day
const currentSimulatedDate = ref(new Date().toISOString().split('T')[0])

// date helper - uses simulated date
const todayKey = () => currentSimulatedDate.value

// daily reports
const dailyReports = ref({})

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

const todayProducts = computed(() => {
  const today = todayKey()
  return products.value.filter((p) => p.purchaseDate === today)
})

/* ================= COMPOSABLE ================= */

export function useProducts() {
  /* ===== PRODUCTS ===== */

  const addProduct = (product) => {
    const today = todayKey()
    const newProduct = {
      ...product,
      id: nextId++,
      purchaseDate: today,
      initialQuantity: product.quantity,
    }

    products.value.push(newProduct)

    // Add expenses for TODAY only
    const report = getTodayReport()
    report.expenses += newProduct.totalPrice
  }

  const updateProduct = (updated) => {
    const index = products.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) {
      const oldProduct = products.value[index]
      const today = todayKey()

      if (oldProduct.purchaseDate === today) {
        const report = getTodayReport()
        report.expenses -= oldProduct.totalPrice
        report.expenses += updated.totalPrice
      }

      products.value[index] = {
        ...updated,
        purchaseDate: oldProduct.purchaseDate,
      }
    }
  }

  const deleteProduct = (id) => {
    const product = products.value.find((p) => p.id === id)
    const today = todayKey()

    if (product && product.purchaseDate === today) {
      const report = getTodayReport()
      report.expenses -= product.totalPrice
    }

    products.value = products.value.filter((p) => p.id !== id)
  }

  const deductProduct = (productId, qty) => {
    const product = products.value.find((p) => p.id === productId)
    if (!product || qty <= 0) return
    product.quantity -= qty
  }

  const deductMultipleProducts = (usageArray) => {
    usageArray.forEach((u) => {
      const product = products.value.find((p) => p.id === u.productId)
      if (!product || u.quantity <= 0) return
      product.quantity -= u.quantity
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

    console.log('=== DAY ENDED ===')
    console.log('Date:', today)
    console.log('Sales:', todayReport.value.sales)
    console.log('Expenses:', todayReport.value.expenses)
    console.log('Profit:', profitToday.value)

    // Advance to next day
    const nextDate = new Date(today)
    nextDate.setDate(nextDate.getDate() + 1)
    currentSimulatedDate.value = nextDate.toISOString().split('T')[0]

    console.log('New date:', currentSimulatedDate.value)
    console.log('================')
  }

  const allReports = computed(() => {
    return Object.entries(dailyReports.value)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, data]) => ({
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
    currentSimulatedDate, // expose para makita sa UI

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
    todayProducts,
    setTodaySales,
    dailyReports,
    allReports,
    endDay,
  }
}
