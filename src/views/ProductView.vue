<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import NavigationDrawer from '@/components/layout/navigation/NavigationDrawer.vue'
import { useProducts } from '@/composables/useProducts.js'

const router = useRouter()

// Use the products composable
const { products, addProduct, updateProduct, deleteProduct, deductProduct, lowStockProducts } = useProducts()

// Reactive data
const drawer = ref(true)
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const valid = ref(false)
const productToDelete = ref(null)

//add
const productForm = ref({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
})

//Deduct
const deductDialog = ref(false)
const selectedProductId = ref(null)
const deductQuantity = ref(0)

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

//add
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
    updateProduct(productData)
  } else {
    addProduct(productData)
  }

  closeDialog()
}

const deleteProductHandler = (product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const confirmDelete = () => {
  deleteProduct(productToDelete.value.id)
  deleteDialog.value = false
  productToDelete.value = null
}

//Deduct
const openDeductDialog = () => {
  selectedProductId.value = null
  deductQuantity.value = 0
  deductDialog.value = true
}

const closeDeductDialog = () => deductDialog.value = false

const submitDeduct = () => {
  if (!selectedProductId.value || deductQuantity.value <= 0) return
  deductProduct(selectedProductId.value, Number(deductQuantity.value))
  closeDeductDialog()
}

</script>

<template>
  <v-app>
    <!-- Navigation Drawer -->
    <NavigationDrawer @logout="handleLogout" />

    <!-- Main Content -->
    <v-main class="app-background">
      <v-container class="pa-4 pa-md-8">
        <!-- Header -->
        <v-row class="mb-8 header-container pa-4 pa-md-8 rounded-xl">
          <v-col
          cols="12"
          class="d-flex flex-column flex-md-row justify-md-space-between align-center ga-4 ga-md-0">
            <h1 class="page-title">Product Inventory</h1>

            <div class="d-flex flex-column flex-sm-row ga-3 ga-sm-4 w-100 w-md-auto">
              <!-- Add Product Button -->
              <v-btn
                class="add-product-btn px-6 px-sm-10 py-2 text-body-2 text-sm-body-1 font-weight-bold flex-grow-1 flex-sm-grow-0"
                rounded="l"
                elevation="6"
                @click="openAddDialog"
              >
                <v-icon start size="small" class="hidden-sm-and-up">mdi-plus-circle</v-icon>
                <v-icon start class="hidden-xs">mdi-plus-circle</v-icon>
                <span class="hidden-xs">Add Product</span>
                <span class="hidden-sm-and-up">Add</span>
              </v-btn>

              <!--Deduct Product Button -->
               <v-btn
                class="deduct-product-btn px-6 px-sm-10 py-2 text-body-2 text-sm-body-1 font-weight-bold flex-grow-1 flex-sm-grow-0"
                rounded="l"
                elevation="6"
                @click="openDeductDialog"
               >
                <v-icon start size="small" class="hidden-sm-and-up">mdi-minus-circle</v-icon>
                <v-icon start class="hidden-xs">mdi-minus-circle</v-icon>
                <span class="hidden-xs">Deduct Product</span>
                <span class="hidden-sm-and-up">Deduct</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Product List Card -->
        <v-row>
          <v-col cols="12" class="product-list-container pa-4 pa-md-8 rounded-xl">
            <v-card class="product-list-card pa-6 pa-md-10 rounded-xl" elevation="4" min-height="550">
              <h2 class="section-title mb-6">Product Inventory List</h2>
              <v-divider class="section-divider mb-10"></v-divider>

              <!-- Product Table -->
              <v-table class="product-table" v-if="products.length > 0">
                <thead>
                  <tr>
                    <th class="table-header">Product Name</th>
                    <th class="table-header">Quantity</th>
                    <th class="table-header">Unit</th>
                    <th class="table-header">Price/Unit</th>
                    <th class="table-header">Total Price</th>
                    <th class="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id" class="product-row">
                    <td class="pa-5">
                      <span class="product-name">{{ product.name }}</span>
                    </td>
                    <td class="pa-5">
                      <span class="product-data">{{ product.quantity }}</span>
                    </td>
                    <td class="pa-5">
                      <span class="product-data">{{ product.unit }}</span>
                    </td>
                    <td class="pa-5">
                      <span class="product-price">₱{{ product.price.toLocaleString() }}</span>
                    </td>
                    <td class="pa-5">
                      <span class="product-total">₱{{ product.totalPrice.toLocaleString() }}</span>
                    </td>
                    <td class="pa-5">
                      <div class="d-flex ga-3">
                        <v-btn
                          class="action-btn edit-btn"
                          icon
                          size="small"
                          elevation="2"
                          @click="editProduct(product)"
                        >
                          <v-icon size="18">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="action-btn delete-btn"
                          icon
                          size="small"
                          elevation="2"
                          @click="deleteProductHandler(product)"
                        >
                          <v-icon size="18">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Empty State -->
              <div v-else class="text-center py-16">
                <div class="empty-state-icon mb-8">
                  <v-icon size="120" class="text-grey-lighten-1">mdi-package-variant-closed</v-icon>
                </div>
                <p class="empty-state-text mb-10">
                  No products in inventory yet. Start by adding your first product!
                </p>

              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Add/Edit Product Dialog -->
      <v-dialog v-model="dialog" max-width="650px" persistent>
        <v-card class="dialog-card rounded-xl" elevation="8">
          <v-card-title class="dialog-header pa-8 pb-6">
            <span class="dialog-title">
              {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
            </span>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form ref="productFormRef" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="productForm.name"
                    label="Product Name"
                    :rules="nameRules"
                    variant="outlined"
                    class="form-field"
                    prepend-inner-icon="mdi-food"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="productForm.quantity"
                    label="Quantity"
                    type="number"
                    :rules="quantityRules"
                    variant="outlined"
                    class="form-field"
                    prepend-inner-icon="mdi-counter"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="productForm.unit"
                    label="Unit"
                    :rules="unitRules"
                    variant="outlined"
                    class="form-field"
                    prepend-inner-icon="mdi-scale"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="productForm.price"
                    label="Price per Unit"
                    type="number"
                    :rules="priceRules"
                    variant="outlined"
                    class="form-field"
                    prepend-inner-icon="mdi-currency-php"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="totalPrice"
                    label="Total Price"
                    readonly
                    variant="outlined"
                    class="form-field total-price-field"
                    prepend-inner-icon="mdi-calculator"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-8 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              class="cancel-btn px-8 py-2"
              size="large"
              rounded="xl"
              @click="closeDialog"
            >
              Cancel
            </v-btn>
            <v-btn
              class="save-btn px-8 py-2 ml-4"
              size="large"
              rounded="xl"
              elevation="4"
              @click="saveProduct"
              :disabled="!valid"
            >
              {{ isEditMode ? 'Update' : 'Add' }} Product
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card class="dialog-card rounded-xl" elevation="8">
          <v-card-title class="delete-dialog-header pa-8 pb-6">
            <v-icon size="48" class="mr-4" color="white">mdi-alert-circle</v-icon>
            <span class="dialog-title text-white">Delete Product</span>
          </v-card-title>

          <v-card-text class="pa-8 text-center">
            <p class="text-h6 mb-4">Are you sure you want to delete</p>
            <p class="text-h5 font-weight-bold text-red-darken-2">"{{ productToDelete?.name }}"?</p>
            <p class="text-body-1 text-grey-darken-1 mt-4">This action cannot be undone.</p>
          </v-card-text>

          <v-card-actions class="pa-8 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              class="cancel-btn px-8 py-5"
              size="large"
              rounded="xl"
              @click="deleteDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="delete-confirm-btn px-8 py-5 ml-4"
              size="large"
              rounded="xl"
              elevation="4"
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

        <!-- Deduct Product Dialog -->
     <!-- Deduct Product Dialog -->
<v-dialog v-model="deductDialog" max-width="650px" persistent>
  <v-card class="dialog-card rounded-xl" elevation="8">
    <v-card-title class="dialog-header pa-8 pb-6">
      <span class="dialog-title">Deduct Product</span>
    </v-card-title>

    <v-card-text class="pa-8">
      <v-form>
        <v-row>
          <!-- Product Select (Dropdown) -->
          <v-col cols="12">
            <v-select
              v-model="selectedProductId"
              :items="products"
              item-text="name"
              item-value="id"
              label="Select Product"
              variant="outlined"
              class="form-field"
              prepend-inner-icon="mdi-food"
              persistent-hint
              hide-details="auto"
              required
            >
              <!-- Optional: slot to show quantity/unit inside dropdown -->
              <template #item="{ item }">
                <div class="d-flex justify-space-between">
                  <span>{{ item.name }}</span>
                  <span class="text-grey">{{ item.quantity }} {{ item.unit }}</span>
                </div>
              </template>
            </v-select>
          </v-col>

          <!-- Deduct Quantity -->
          <v-col cols="6">
            <v-text-field
              v-model="deductQuantity"
              type="number"
              label="Quantity to Deduct"
              variant="outlined"
              class="form-field"
              prepend-inner-icon="mdi-counter"
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

        <v-card-actions class="pa-8 pt-0">
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        class="cancel-btn px-8 py-2"
        size="large"
        rounded="xl"
        @click="closeDeductDialog"
      >
        Cancel
      </v-btn>
      <v-btn
        class="save-btn px-8 py-2 ml-4"
        size="large"
        rounded="xl"
        elevation="4"
        color="red"
        @click="submitDeduct"
        :disabled="!selectedProductId || deductQuantity <= 0"
      >
        Deduct
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    </v-main>
  </v-app>
</template>

<style scoped>
.app-background {
  background: linear-gradient(135deg, #FFF5F5 0%, #FFE4E1 100%);
  min-height: 100vh;
}

/* Header Styles */
.header-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.2);
}

/* Responsive Header */
@media (max-width: 960px) {
  .header-container {
    padding: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .header-container {
    padding: 1rem !important;
  }
}

.page-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsive Title */
@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}

/* Add Product Button */
.add-product-btn {
  background: linear-gradient(135deg, #FFF 0%, #FFE4E1 100%) !important;
  color: #8B0000 !important;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3) !important;
  border: 2px solid rgba(139, 0, 0, 0.2);
}

.add-product-btn:hover {
  background: linear-gradient(135deg, #FFE4E1 0%, #FFF 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 255, 255, 0.5) !important;
  border-color: rgba(139, 0, 0, 0.4);
}

/* Deduct Product Button */
.deduct-product-btn {
  background: linear-gradient(135deg, #FFE4E1 0%, #FFF 100%) !important;
  color: #8B0000 !important;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3) !important;
  border: 2px solid rgba(139, 0, 0, 0.2);
}

.deduct-product-btn:hover {
  background: linear-gradient(135deg, #FFF 0%, #FFE4E1 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 255, 255, 0.5) !important;
  border-color: rgba(139, 0, 0, 0.4);
}

/* Responsive Buttons */
@media (max-width: 960px) {
  .add-product-btn,
  .deduct-product-btn {
    padding: 12px 16px !important;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .add-product-btn,
  .deduct-product-btn {
    padding: 10px 12px !important;
    font-size: 0.85rem;
    width: 100%;
  }
}

/* Product List Container */
.product-list-container {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.2);
}

.product-list-card {
  background: white;
  border: 1px solid rgba(139, 0, 0, 0.1);
}

.section-title {
  color: #8B0000;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

/* Responsive Section Title */
@media (max-width: 960px) {
  .section-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.5rem;
  }
}

.section-divider {
  border-color: rgba(139, 0, 0, 0.2);
  border-width: 2px;
}

/* Product Table Styles */
.product-table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.table-header {
  background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  padding: 20px !important;
  border-bottom: none !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Table */
@media (max-width: 960px) {
  .table-header {
    font-size: 0.85rem !important;
    padding: 15px !important;
  }
}

@media (max-width: 600px) {
  .table-header {
    font-size: 0.75rem !important;
    padding: 10px !important;
  }

  .product-table {
    font-size: 0.85rem;
  }
}

.product-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.product-row:hover {
  background: linear-gradient(90deg, #FFF5F5 0%, #FFE4E1 100%) !important;
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);
}

.product-row:last-child {
  border-bottom: none;
}

.product-name {
  color: #8B0000;
  font-weight: 600;
  font-size: 1rem;
}

.product-data {
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
}

.product-price {
  color: #2E7D32;
  font-weight: 600;
  font-size: 1rem;
}

.product-total {
  color: #8B0000;
  font-weight: 700;
  font-size: 1.05rem;
}

/* Action Buttons */
.action-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.edit-btn {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%) !important;
  color: white !important;
}

.edit-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4) !important;
}

.delete-btn {
  background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%) !important;
  color: white !important;
}

.delete-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 16px rgba(211, 47, 47, 0.4) !important;
}

/* Empty State */
.empty-state-icon {
  background: linear-gradient(135deg, #FFE4E1 0%, #FFF5F5 100%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(139, 0, 0, 0.1);
}

.empty-state-text {
  color: #666;
  font-size: 1.25rem;
  line-height: 1.6;
}

/* Dialog Styles */
.dialog-card {
  border: 2px solid rgba(139, 0, 0, 0.1);
}

.dialog-header {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  border-bottom: 3px solid #DC143C;
}

.dialog-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%);
  border-bottom: 3px solid #B71C1C;
}

/* Form Fields */
.form-field :deep(.v-field) {
  border: 2px solid rgba(139, 0, 0, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-field :deep(.v-field:hover) {
  border-color: #B22222;
}

.form-field :deep(.v-field--focused) {
  border-color: #8B0000;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}

.total-price-field :deep(.v-field) {
  background: linear-gradient(135deg, #FFF5F5 0%, #FFE4E1 100%);
  font-weight: 700;
  color: #8B0000;
}

/* Dialog Buttons */
.cancel-btn {
  color: #666 !important;
  border: 2px solid #ddd !important;
  text-transform: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #999 !important;
  background: #f5f5f5 !important;
}

.save-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(135deg, #B22222 0%, #DC143C 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(139, 0, 0, 0.4) !important;
}

.delete-confirm-btn {
  background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.delete-confirm-btn:hover {
  background: linear-gradient(135deg, #C62828 0%, #B71C1C 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(211, 47, 47, 0.4) !important;
}
</style>
