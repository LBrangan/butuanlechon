import { supabase } from '@/supabase'
import { useAuthUserStore } from '@/stores/authUser'

export function useInventory() {
  const user = useAuthUserStore()

  const fetchInventory = async () => {
    return await supabase
      .from('inventory')
      .select(`
        inv_id,
        item_name,
        quantity,
        unit,
        expiry_date,
        categories ( name ),
        users ( firstname, lastname )
      `)
      .order('date_added', { ascending: false })
  }

  const addItem = async (item) => {
    return await supabase.from('inventory').insert({
      item_name: item.name,
      description: item.description,
      category_id: item.category_id,
      unit: item.unit,
      quantity: item.quantity,
      expiry_date: item.expiry_date,
      added_by: user.value.id
    })
  }

  const updateQuantity = async (inv_id, qty) => {
    return await supabase
      .from('inventory')
      .update({ quantity: qty })
      .eq('inv_id', inv_id)
  }

  return {
    fetchInventory,
    addItem,
    updateQuantity
  }
}
