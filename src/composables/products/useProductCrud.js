import { useAuthUserStore } from '@/stores/authUser'
import { getClient, getBranchId } from './useProductClient'
import { products, currentSimulatedDate, todayKey, dailyReports } from './useProductState'

export const fetchProducts = async () => {
  try {
    const authStore = useAuthUserStore()
    let query = getClient().from('inventory').select('*').order('item_name', { ascending: true })

    if (authStore.userRole !== 'Super Administrator') {
      const branchId = await getBranchId()
      if (!branchId) { products.value = []; return [] }
      query = query.eq('branch_id', branchId)
    }

    const { data, error } = await query
    if (error) throw error

    products.value = (data || []).map((item) => ({
      id: item.inv_id,
      name: item.item_name,
      quantity: Number(item.quantity),
      unit: item.unit,
      price: Number(item.price),
      totalPrice: Number(item.quantity) * Number(item.price),
      purchaseDate: item.purchase_date || currentSimulatedDate.value,
      initialQuantity: Number(item.quantity),
    }))

    return products.value
  } catch (e) {
    console.error('fetchProducts:', e)
    return []
  }
}

export const addProduct = async (product, customDate = null) => {
  try {
    const authStore = useAuthUserStore()
    const purchaseDate = customDate || todayKey()
    const branch_id = product.branch_id || await getBranchId()
    if (!branch_id) { console.error('No branch_id'); return }

    // Merge if same name exists
    const existing = products.value.find(
      (p) => p.name.toLowerCase() === product.name.toLowerCase()
    )

    if (existing) {
      const oldVal = Number(existing.quantity) * Number(existing.price)
      const newVal = Number(product.quantity) * Number(product.price)
      const newQty = Number(existing.quantity) + Number(product.quantity)
      return await updateProduct({
        ...existing,
        quantity: newQty,
        price: (oldVal + newVal) / newQty,
        totalPrice: newQty * ((oldVal + newVal) / newQty),
        _additionalExpense: newVal,
        _addedOnDate: purchaseDate,
      })
    }

    const { data, error } = await getClient()
      .from('inventory')
      .insert([{
        item_name: product.name,
        quantity: product.quantity,
        unit: product.unit || 'piece(s)',
        price: product.price,
        purchase_date: purchaseDate,
        branch_id,
        created_by: authStore.userData?.id,
      }])
      .select()

    if (error) throw error

    if (data?.[0]) {
      const p = data[0]
      products.value.push({
        id: p.inv_id, name: p.item_name,
        quantity: Number(p.quantity), unit: p.unit, price: Number(p.price),
        totalPrice: Number(p.quantity) * Number(p.price),
        purchaseDate, initialQuantity: Number(p.quantity),
      })
      if (!dailyReports.value[purchaseDate]) dailyReports.value[purchaseDate] = { sales: 0, expenses: 0 }
      dailyReports.value[purchaseDate].expenses += Number(product.quantity) * Number(product.price)
    }

    return data
  } catch (e) { console.error('addProduct:', e) }
}

export const updateProduct = async (updated) => {
  try {
    const oldProduct = products.value.find((p) => p.id === updated.id)
    const newTotalPrice = updated.totalPrice || updated.quantity * updated.price

    const { data, error } = await getClient()
      .from('inventory')
      .update({ item_name: updated.name, quantity: updated.quantity, unit: updated.unit, price: updated.price })
      .eq('inv_id', updated.id)
      .select()

    if (error) throw error

    const index = products.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) {
      if (oldProduct?.purchaseDate) {
        const r = dailyReports.value[oldProduct.purchaseDate] ??= { sales: 0, expenses: 0 }
        r.expenses -= oldProduct.totalPrice
        r.expenses += newTotalPrice
      }
      if (updated._additionalExpense && updated._addedOnDate) {
        const r = dailyReports.value[updated._addedOnDate] ??= { sales: 0, expenses: 0 }
        r.expenses += updated._additionalExpense
      }
      products.value[index] = { ...updated, purchaseDate: oldProduct?.purchaseDate, totalPrice: newTotalPrice }
    }

    return data
  } catch (e) { console.error('updateProduct:', e) }
}

export const deleteProduct = async (id) => {
  try {
    const product = products.value.find((p) => p.id === id)
    const { error } = await getClient().from('inventory').delete().eq('inv_id', id)
    if (error) throw error

    if (product?.purchaseDate) {
      const r = dailyReports.value[product.purchaseDate] ??= { sales: 0, expenses: 0 }
      r.expenses -= product.totalPrice
    }
    products.value = products.value.filter((p) => p.id !== id)
  } catch (e) { console.error('deleteProduct:', e) }
}
