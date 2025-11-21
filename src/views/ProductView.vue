<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import Navigation from '@/components/layout/navigation/Navigation.vue'

const router = useRouter()

// Reactive data
const drawer = ref(true)
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const valid = ref(false)
const productToDelete = ref(null)

const menuItems = ref([
  {
    title: 'Dashboard',
    icon: 'mdi-chart-box-outline',
    active: false,
  },
  {
    title: 'Product',
    icon: 'mdi-package-variant',
    active: true,
  },
])

const products = ref([
  {
    id: 1,
    name: 'Chicken Gordon',
    quantity: 2,
    unit: '10mg',
    price: 150,
    totalPrice: 300,
  },
  {
    id: 2,
    name: 'Pancit Cantoon',
    quantity: 1,
    unit: '1kg',
    price: 200,
    totalPrice: 200,
  },
])

const productForm = ref({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
})

// Form validation rules
const nameRules = [
  (v) => !!v || 'Product name is required',
  (v) => (v && v.length >= 2) || 'Product name must be at least 2 characters',
]

const quantityRules = [
  (v) => !!v || 'Quantity is required',
  (v) => v > 0 || 'Quantity must be greater than 0',
]

const unitRules = [(v) => !!v || 'Unit is required']

const priceRules = [
  (v) => !!v || 'Price is required',
  (v) => v > 0 || 'Price must be greater than 0',
]

// Computed properties
const totalPrice = computed(() => {
  return productForm.value.quantity * productForm.value.price || 0
})

// Methods
const handleLogout = () => {
  router.push('/')
}

const setActiveItem = (title) => {
  menuItems.value.forEach((item) => {
    item.active = item.title === title
  })

  if (title === 'Dashboard') {
    router.push('/dashboard')
  } else if (title === 'Product') {
    router.push('/product')
  }
}

const openAddDialog = () => {
  isEditMode.value = false
  productForm.value = {
    name: '',
    quantity: 0,
    unit: '',
    price: 0,
  }
  dialog.value = true
}

const editProduct = (product) => {
  isEditMode.value = true
  productForm.value = { ...product }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  isEditMode.value = false
  productForm.value = {
    name: '',
    quantity: 0,
    unit: '',
    price: 0,
  }
}

const saveProduct = () => {
  if (!valid.value) return

  const productData = {
    ...productForm.value,
    totalPrice: totalPrice.value,
  }

  if (isEditMode.value) {
    const index = products.value.findIndex((p) => p.id === productForm.value.id)
    if (index !== -1) {
      products.value[index] = productData
    }
  } else {
    productData.id = Date.now() // Simple ID generation
    products.value.push(productData)
  }

  closeDialog()
}

const deleteProduct = (product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const confirmDelete = () => {
  const index = products.value.findIndex((p) => p.id === productToDelete.value.id)
  if (index !== -1) {
    products.value.splice(index, 1)
  }
  deleteDialog.value = false
  productToDelete.value = null
}
</script>

<template>
  <v-main class="app-background">
    <!-- Navigation Drawer -->
    <NavigationDrawer
      :drawer="drawer"
      :menuItems="menuItems"
      @setActiveItem="setActiveItem"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <v-container class="pa-8">
      <div>
           <!-- Header -->
      <v-row class="mb-8 bg-blue-lighten-1 pa-6 rounded-xl">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="text-h3 font-weight-medium text-grey-darken-4">Product</h1>

          <!-- Add Product Button -->
          <v-btn
            color="blue-darken-3"
            size="large"
            rounded="xl"
            class="px-8 py-3 text-body-1 font-weight-medium"
            elevation="0"
            @click="openAddDialog"
          >
            <v-icon start size="20">mdi-plus</v-icon>
            Add Product
          </v-btn>
        </v-col>
      </v-row>

      <!-- Product List Card -->
      <v-row>
        <v-col cols="12">
          <v-card class="bg-blue-lighten-1 pa-10 rounded-xl" elevation="0" color="white" min-height="500">
            <h2 class="text-h4 font-weight-medium text-grey-darken-4 mb-8">Product List</h2>
            <v-divider class="mb-8"></v-divider>

            <!-- Product Table -->
            <v-table class="product-table" v-if="products.length > 0">
              <thead>
                <tr>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">
                    Product Name
                  </th>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">
                    Quantity
                  </th>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">Unit</th>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">
                    Total Price
                  </th>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">
                    Price
                  </th>
                  <th class="text-left text-h6 font-weight-medium text-grey-darken-2 pa-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id" class="product-row">
                  <td class="pa-4">
                    <span class="text-body-1 text-grey-darken-1 font-weight-regular">{{
                      product.name
                    }}</span>
                  </td>
                  <td class="pa-4">
                    <span class="text-body-1 text-grey-darken-1">{{ product.quantity }}</span>
                  </td>
                  <td class="pa-4">
                    <span class="text-body-1 text-grey-darken-1">{{ product.unit }}</span>
                  </td>
                  <td class="pa-4">
                    <span class="text-body-1 text-grey-darken-1">{{ product.totalPrice }}</span>
                  </td>
                  <td class="pa-4">
                    <span class="text-body-1 text-grey-darken-1">{{ product.price }}</span>
                  </td>
                  <td class="pa-4">
                    <div class="d-flex ga-2">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="grey-darken-2"
                        @click="editProduct(product)"
                      >
                        <v-icon size="20">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="red-darken-2"
                        @click="deleteProduct(product)"
                      >
                        <v-icon size="20">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <!-- Empty State -->
            <div v-else class="text-center py-16">
              <v-icon size="100" class="text-grey-lighten-2 mb-6"
                >mdi-package-variant-closed</v-icon
              >
              <p class="text-h5 text-grey-lighten-1 mb-8 font-weight-regular">
                No products yet. Start by adding your first product!
              </p>
              <v-btn
                color="blue-darken-2"
                size="large"
                rounded="xl"
                class="px-8 py-3 text-body-1 font-weight-medium"
                elevation="0"
                @click="openAddDialog"
              >
                <v-icon start size="20">mdi-plus</v-icon>
                Add Product
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
      </div>

    </v-container>

    <!-- Add/Edit Product Dialog -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="pa-6 pb-2">
          <span class="text-h4 font-weight-medium text-grey-darken-4">
            {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
          </span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="productForm" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="productForm.name"
                  label="Product Name"
                  :rules="nameRules"
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="productForm.quantity"
                  label="Quantity"
                  type="number"
                  :rules="quantityRules"
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="productForm.unit"
                  label="Unit"
                  :rules="unitRules"
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="productForm.price"
                  label="Price per Unit"
                  type="number"
                  :rules="priceRules"
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="totalPrice"
                  label="Total Price"
                  readonly
                  variant="outlined"
                  class="mb-4"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" @click="closeDialog"> Cancel </v-btn>
          <v-btn color="red-darken-2" @click="saveProduct" :disabled="!valid" class="ml-2">
            {{ editMode ? 'Update' : 'Add' }} Product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="rounded-xl">
        <v-card-title class="pa-6 pb-2">
          <span class="text-h5 font-weight-medium text-grey-darken-4">Delete Product</span>
        </v-card-title>

        <v-card-text class="pa-6">
          Are you sure you want to delete "{{ productToDelete?.name }}"?
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn color="red-darken-2" @click="confirmDelete" class="ml-2"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<style scoped>


/* Active sidebar item */


/* Product table styling */
.product-table {
  border-collapse: separate;
  border-spacing: 0;
}

.product-table th {
  background-color: #fafafa;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 500 !important;
}

.product-row {
  transition: background-color 0.2s ease;
}

.product-row:hover {
  background-color: #f8f8f8;
}

.product-row td {
  border-bottom: 1px solid #f0f0f0;
}

.v-field.v-field--outlined {
  border: 1px solid #ccc !important;
}
</style>
