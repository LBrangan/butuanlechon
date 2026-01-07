import { ref } from 'vue'

// Global products state - shared across all components
const products = ref([])
let nextId = 1

// Named export
export function useProducts() {
  const addProduct = (product) => {
    products.value.push({
      ...product,
      id: nextId++
    })
  }

  const updateProduct = (updatedProduct) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  const deleteProduct = (id) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
