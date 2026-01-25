import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'

/* ================= GLOBAL STATE ================= */

const products = ref([])

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

  // Fetch all inventory from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('item_name', { ascending: true })

      if (error) throw error

      // Map Supabase columns to local product structure
      const mappedData = (data || []).map((item) => ({
        id: item.inv_id,
        name: item.item_name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        totalPrice: item.quantity * item.price,
        purchaseDate: currentSimulatedDate.value,
        initialQuantity: item.quantity,
      }))

      products.value = mappedData
      return mappedData
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  const addProduct = async (product, customDate = null) => {
    try {
      const purchaseDate = customDate || todayKey()
      const totalPrice = product.totalPrice || product.quantity * product.price

      const { data, error } = await supabase
        .from('inventory')
        .insert([
          {
            item_name: product.name,
            quantity: product.quantity,
            unit: product.unit || 'piece(s)',
            price: product.price,
          },
        ])
        .select()

      if (error) throw error

      // Add to local state
      if (data && data.length > 0) {
        const newProduct = {
          id: data[0].inv_id,
          name: data[0].item_name,
          quantity: data[0].quantity,
          unit: data[0].unit,
          price: data[0].price,
          totalPrice: totalPrice,
          purchaseDate: purchaseDate,
          initialQuantity: data[0].quantity,
        }
        products.value.push(newProduct)

        // Add expenses to the SPECIFIC date's report
        if (!dailyReports.value[purchaseDate]) {
          dailyReports.value[purchaseDate] = { sales: 0, expenses: 0 }
        }
        dailyReports.value[purchaseDate].expenses += totalPrice
      }

      return data
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const updateProduct = async (updated) => {
    try {
      const oldProduct = products.value.find((p) => p.id === updated.id)
      const today = todayKey()

      const newTotalPrice = updated.totalPrice || updated.quantity * updated.price

      // Update in Supabase
      const { data, error } = await supabase
        .from('inventory')
        .update({
          item_name: updated.name,
          quantity: updated.quantity,
          unit: updated.unit,
          price: updated.price,
        })
        .eq('inv_id', updated.id)
        .select()

      if (error) throw error

      // Update local state
      const index = products.value.findIndex((p) => p.id === updated.id)
      if (index !== -1) {
        if (oldProduct && oldProduct.purchaseDate === today) {
          const report = getTodayReport()
          report.expenses -= oldProduct.totalPrice
          report.expenses += newTotalPrice
        }

        products.value[index] = {
          ...updated,
          purchaseDate: oldProduct?.purchaseDate,
          totalPrice: newTotalPrice,
        }
      }

      return data
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      const product = products.value.find((p) => p.id === id)
      const today = todayKey()

      // Delete from Supabase
      const { error } = await supabase.from('inventory').delete().eq('inv_id', id)

      if (error) throw error

      // Update local state and reports
      if (product && product.purchaseDate === today) {
        const report = getTodayReport()
        report.expenses -= product.totalPrice
      }

      products.value = products.value.filter((p) => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const deductProduct = async (productId, qty) => {
    try {
      const product = products.value.find((p) => p.id === productId)
      if (!product || qty <= 0) return

      const newQuantity = Math.max(0, product.quantity - qty)

      // Update in Supabase
      const { data, error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('inv_id', productId)
        .select()

      if (error) throw error

      // Update local state
      product.quantity = newQuantity

      return data
    } catch (error) {
      console.error('Error deducting product:', error)
    }
  }

  const deductMultipleProducts = async (usageArray) => {
    try {
      for (const u of usageArray) {
        const product = products.value.find((p) => p.id === u.productId)
        if (product && u.quantity > 0) {
          await deductProduct(u.productId, u.quantity)
        }
      }
    } catch (error) {
      console.error('Error deducting multiple products:', error)
    }
  }

  /* ===== SALES ===== */

  const setTodaySales = (amount) => {
    const report = getTodayReport()
    report.sales = Number(amount) || 0
  }

  /* ===== DATE MANAGEMENT ===== */

  const setBusinessDate = (newDate) => {
    currentSimulatedDate.value = newDate
  }

  /* ===== END DAY / REPORTS ===== */

  const saveDailyReport = async () => {
    const today = todayKey()
    const report = getTodayReport()

    try {
      const { data, error } = await supabase
        .from('daily_reports')
        .insert([
          {
            report_date: today,
            sales: report.sales,
            expenses: report.expenses,
            profit: report.sales - report.expenses,
          },
        ])
        .select()

      if (error) throw error

      console.log('Daily report saved successfully:', data)
      return data
    } catch (error) {
      console.error('Error saving daily report:', error)
      // Continue even if save fails - don't block the day advancement
    }
  }

  const endDay = async () => {
    const today = todayKey()

    console.log('=== DAY ENDED ===')
    console.log('Date:', today)
    console.log('Sales:', todayReport.value.sales)
    console.log('Expenses:', todayReport.value.expenses)
    console.log('Profit:', profitToday.value)

    // Save the daily report to database
    await saveDailyReport()

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
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,

    // date management
    setBusinessDate,

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
