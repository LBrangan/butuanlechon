import { ref, computed } from 'vue'

// Global products state - shared across all components
const products = ref([])
let nextId = 1

export function useProducts() {
  // Add new product
  const addProduct = (product) => {
    products.value.push({
      ...product,
      id: nextId++,
      totalPrice: product.quantity * product.price
    })
  }

  // Update existing product
  const updateProduct = (updatedProduct) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      updatedProduct.totalPrice = updatedProduct.quantity * updatedProduct.price
      products.value[index] = { ...updatedProduct }
    }
  }

  // Delete product
  const deleteProduct = (id) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  // Deduct product quantity
  const deductProduct = (id, quantity) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index].quantity -= quantity
      if (products.value[index].quantity < 0) products.value[index].quantity = 0
      products.value[index].totalPrice = products.value[index].quantity * products.value[index].price
    }
  }

  // Computed: products with quantity < 10
  const lowStockProducts = computed(() =>
    products.value.filter(p => p.quantity < 10)
  )

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    deductProduct,
    lowStockProducts
  }
}
