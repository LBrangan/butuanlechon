<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts.js'

const router = useRouter()
const isRefreshing = ref(false)

const {
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  deductProduct,
  lowStockProducts,
  currentSimulatedDate,
  fetchProducts,
} = useProducts()

// Fetch products on component mount
onMounted(async () => {
  await fetchProducts()
})

// Reactive data
const drawer = ref(true)
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const valid = ref(false)
const productToDelete = ref(null)

// NEW: Warning dialog for editing products
const editWarningDialog = ref(false)
const productToEdit = ref(null)

// NEW: Update with additional stock tracking
const updateStockDialog = ref(false)
const additionalQuantity = ref(0)
const additionalPricePerUnit = ref(0)

//add
const productForm = ref({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
  purchaseDate: currentSimulatedDate.value,
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

const additionalTotalPrice = computed(() => {
  return additionalQuantity.value * additionalPricePerUnit.value || 0
})

// Group products by name for better display
const groupedProducts = computed(() => {
  const groups = {}
  products.value.forEach((product) => {
    if (!groups[product.name]) {
      groups[product.name] = []
    }
    groups[product.name].push(product)
  })
  return groups
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
    purchaseDate: currentSimulatedDate.value,
  }
  dialog.value = true
}

const editProduct = (product) => {
  // Check if this product was purchased on a previous date
  if (product.purchaseDate !== currentSimulatedDate.value) {
    productToEdit.value = product
    editWarningDialog.value = true
  } else {
    proceedToEdit(product)
  }
}

const proceedToEdit = (product) => {
  isEditMode.value = true
  productForm.value = { ...product }
  dialog.value = true
  editWarningDialog.value = false
}

const updateExistingStock = () => {
  const product = productToEdit.value
  editWarningDialog.value = false

  // Open update stock dialog
  productToEdit.value = product
  additionalQuantity.value = 0
  additionalPricePerUnit.value = product.price // Default to existing price
  updateStockDialog.value = true
}

const confirmStockUpdate = async () => {
  const product = productToEdit.value
  const addedQty = Number(additionalQuantity.value)
  const pricePerUnit = Number(additionalPricePerUnit.value)

  if (addedQty <= 0 || pricePerUnit <= 0) return

  // Calculate new total quantity and weighted average price
  const oldTotalValue = product.quantity * product.price
  const addedValue = addedQty * pricePerUnit
  const newQuantity = product.quantity + addedQty
  const newAveragePrice = (oldTotalValue + addedValue) / newQuantity

  // Update product with new values
  const updatedProduct = {
    ...product,
    quantity: newQuantity,
    price: newAveragePrice,
    totalPrice: newQuantity * newAveragePrice,
    _additionalExpense: addedValue, // Track additional expense for today
    _addedOnDate: currentSimulatedDate.value, // Track when added
  }

  await updateProduct(updatedProduct)

  updateStockDialog.value = false
  productToEdit.value = null
  additionalQuantity.value = 0
  additionalPricePerUnit.value = 0
}

const closeDialog = () => {
  dialog.value = false
  isEditMode.value = false
  productForm.value = {
    name: '',
    quantity: 0,
    unit: '',
    price: 0,
    purchaseDate: currentSimulatedDate.value,
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
    // Pass custom date if different from current business date
    addProduct(productData, productForm.value.purchaseDate)
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
const openDeductDialog = async () => {
  selectedProductId.value = null
  deductQuantity.value = 0
  try {
    await fetchProducts()
    console.log('Products loaded:', products.value)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  deductDialog.value = true
}

const closeDeductDialog = () => (deductDialog.value = false)

const submitDeduct = () => {
  if (!selectedProductId.value || deductQuantity.value <= 0) return
  deductProduct(selectedProductId.value, Number(deductQuantity.value))
  closeDeductDialog()
}
const refreshInventory = async () => {
  isRefreshing.value = true
  try {
    await fetchProducts()
  } finally {
    // Add a slight delay for better UX so the user sees the spin
    setTimeout(() => {
      isRefreshing.value = false
    }, 500)
  }
}
</script>

<template>
  <div class="app-background">
    <v-container class="pa-4 pa-md-8" fluid>
      <!-- Header -->
      <div class="header-bar mb-8">
        <div class="header-inner px-6 px-md-10 py-5">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center ga-4">
              <div class="header-icon-wrap">
                <v-icon size="28" color="white">mdi-package-variant</v-icon>
              </div>
              <div>
                <p class="header-eyebrow">Inventory Management</p>
                <h1 class="header-title">Product Inventory</h1>
              </div>
            </div>

            <div class="d-flex align-center ga-3 flex-wrap">
              <v-btn class="action-header-btn" variant="flat" rounded="lg" @click="openAddDialog">
                <v-icon start size="18">mdi-plus</v-icon>
                Add Product
              </v-btn>

              <v-btn
                icon
                variant="text"
                class="refresh-btn"
                :loading="isRefreshing"
                @click="refreshInventory"
              >
                <v-icon size="20">mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="bottom">Refresh Inventory</v-tooltip>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <v-row class="mb-6" dense>
        <v-col cols="12" sm="4">
          <div class="stat-card">
            <div class="stat-icon-wrap stat-blue">
              <v-icon size="22" color="white">mdi-archive-outline</v-icon>
            </div>
            <div>
              <p class="stat-label">Total Products</p>
              <p class="stat-value">{{ products.length }}</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="stat-card">
            <div class="stat-icon-wrap stat-red">
              <v-icon size="22" color="white">mdi-alert-circle-outline</v-icon>
            </div>
            <div>
              <p class="stat-label">Low Stock Items</p>
              <p class="stat-value">{{ lowStockProducts.length }}</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="stat-card">
            <div class="stat-icon-wrap stat-green">
              <v-icon size="22" color="white">mdi-calendar-today</v-icon>
            </div>
            <div>
              <p class="stat-label">Business Date</p>
              <p class="stat-value stat-value--sm">{{ currentSimulatedDate }}</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Product Table Card -->
      <div class="table-card">
        <!-- Card Header -->
        <div class="table-card-header px-6 py-5">
          <div class="d-flex align-center justify-space-between flex-wrap ga-3">
            <div class="d-flex align-center ga-3">
              <h2 class="table-card-title">Product List</h2>
              <v-chip size="small" class="count-chip">{{ products.length }} items</v-chip>
            </div>
            <v-alert type="info" variant="tonal" density="compact" class="tip-alert" border="start">
              <span class="text-caption"
                >Products with same name but different purchase dates are tracked separately.</span
              >
            </v-alert>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Table -->
        <div class="table-wrap" v-if="products.length > 0">
          <v-table class="product-table" hover>
            <thead>
              <tr>
                <th class="th-cell">Product Name</th>
                <th class="th-cell">Purchase Date</th>
                <th class="th-cell">Quantity</th>
                <th class="th-cell">Price / Unit</th>
                <th class="th-cell">Total Value</th>
                <th class="th-cell text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="td-row">
                <td class="td-cell">
                  <div class="d-flex align-center ga-3">
                    <div class="product-avatar">
                      {{ product.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="product-name-text">{{ product.name }}</span>
                  </div>
                </td>
                <td class="td-cell">
                  <v-chip
                    size="small"
                    :color="product.purchaseDate === currentSimulatedDate ? 'success' : 'blue-grey'"
                    variant="tonal"
                    class="date-chip"
                  >
                    <v-icon start size="12">mdi-calendar</v-icon>
                    {{ product.purchaseDate }}
                    <v-tooltip activator="parent" location="top">
                      {{
                        product.purchaseDate === currentSimulatedDate
                          ? 'Purchased TODAY'
                          : 'Purchased on ' + product.purchaseDate
                      }}
                    </v-tooltip>
                  </v-chip>
                </td>
                <td class="td-cell">
                  <div class="d-flex align-center ga-2">
                    <span class="qty-badge" :class="product.quantity <= 10 ? 'qty-low' : 'qty-ok'">
                      {{ product.quantity }}
                    </span>
                    <span class="unit-text">{{ product.unit }}</span>
                  </div>
                </td>
                <td class="td-cell">
                  <span class="price-text">₱{{ product.price.toLocaleString() }}</span>
                </td>
                <td class="td-cell">
                  <span class="total-text">₱{{ product.totalPrice.toLocaleString() }}</span>
                </td>
                <td class="td-cell text-center">
                  <div class="d-flex justify-center ga-2">
                    <v-btn
                      icon
                      size="small"
                      variant="tonal"
                      color="primary"
                      class="tbl-btn"
                      @click="editProduct(product)"
                    >
                      <v-icon size="16">mdi-pencil-outline</v-icon>
                      <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      variant="tonal"
                      color="error"
                      class="tbl-btn"
                      @click="deleteProductHandler(product)"
                    >
                      <v-icon size="16">mdi-trash-can-outline</v-icon>
                      <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state py-16">
          <div class="empty-icon-wrap mb-6">
            <v-icon size="56" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
          </div>
          <p class="empty-title mb-2">No products yet</p>
          <p class="empty-sub mb-6">Start by adding your first product to the inventory.</p>
          <v-btn class="action-header-btn" rounded="lg" @click="openAddDialog">
            <v-icon start size="18">mdi-plus</v-icon>
            Add First Product
          </v-btn>
        </div>
      </div>
    </v-container>

    <!-- ═══════════════ DIALOGS ═══════════════ -->

    <!-- Edit Warning Dialog -->
    <v-dialog v-model="editWarningDialog" max-width="560px">
      <v-card class="dlg-card" rounded="xl" elevation="12">
        <div class="dlg-header dlg-header--warning px-8 py-6">
          <div class="d-flex align-center ga-3">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
            <span class="dlg-title">Old Stock — Edit Warning</span>
          </div>
        </div>

        <v-card-text class="px-8 py-6">
          <p class="text-body-1 mb-4">
            This product was purchased on
            <strong class="text-warning">{{ productToEdit?.purchaseDate }}</strong
            >. What would you like to do?
          </p>

          <div class="choice-grid">
            <div class="choice-card choice-card--green" @click="updateExistingStock">
              <v-icon size="28" color="success" class="mb-2">mdi-package-variant-plus</v-icon>
              <p class="choice-title">Add New Stock</p>
              <p class="choice-desc">Adds qty & cost to today's records</p>
            </div>
            <div class="choice-card choice-card--blue" @click="proceedToEdit(productToEdit)">
              <v-icon size="28" color="info" class="mb-2">mdi-pencil-outline</v-icon>
              <p class="choice-title">Edit Old Entry</p>
              <p class="choice-desc">Fix a typo or wrong price from before</p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="px-8 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            rounded="lg"
            class="dlg-cancel-btn"
            @click="editWarningDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Stock Dialog -->
    <v-dialog v-model="updateStockDialog" max-width="620px" persistent>
      <v-card class="dlg-card" rounded="xl" elevation="12">
        <div class="dlg-header px-8 py-6">
          <div class="d-flex align-center ga-3">
            <v-icon size="26" color="white">mdi-package-variant-plus</v-icon>
            <span class="dlg-title">Update Stock — {{ productToEdit?.name }}</span>
          </div>
        </div>

        <v-card-text class="px-8 py-6">
          <!-- Current stock summary -->
          <div class="stock-summary mb-6">
            <div class="stock-summary-row">
              <span class="ss-label">Current Quantity</span>
              <span class="ss-val">{{ productToEdit?.quantity }} {{ productToEdit?.unit }}</span>
            </div>
            <div class="stock-summary-row">
              <span class="ss-label">Price / Unit</span>
              <span class="ss-val">₱{{ productToEdit?.price?.toLocaleString() }}</span>
            </div>
            <div class="stock-summary-row">
              <span class="ss-label">Total Value</span>
              <span class="ss-val ss-val--bold"
                >₱{{ productToEdit?.totalPrice?.toLocaleString() }}</span
              >
            </div>
          </div>

          <p class="field-section-label mb-4">Adding New Stock — {{ currentSimulatedDate }}</p>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="additionalQuantity"
                label="Additional Quantity"
                type="number"
                variant="outlined"
                class="form-field"
                prepend-inner-icon="mdi-plus"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="additionalPricePerUnit"
                label="Price per Unit"
                type="number"
                variant="outlined"
                class="form-field"
                prepend-inner-icon="mdi-currency-php"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Cost today -->
          <div class="cost-today-box mb-4">
            <span class="cost-label">Additional Cost Today</span>
            <span class="cost-value">₱{{ additionalTotalPrice.toLocaleString() }}</span>
          </div>

          <!-- Preview -->
          <div class="preview-box">
            <p class="preview-label mb-3">After Update Preview</p>
            <div class="preview-row">
              <span>New Quantity</span>
              <strong
                >{{ Number(productToEdit?.quantity || 0) + Number(additionalQuantity || 0) }}
                {{ productToEdit?.unit }}</strong
              >
            </div>
            <div class="preview-row">
              <span>Avg Price / Unit</span>
              <strong
                >₱{{
                  (
                    ((productToEdit?.quantity || 0) * (productToEdit?.price || 0) +
                      additionalTotalPrice) /
                    (Number(productToEdit?.quantity || 0) + Number(additionalQuantity || 0) || 1)
                  ).toFixed(2)
                }}</strong
              >
            </div>
            <div class="preview-row">
              <span>New Total Value</span>
              <strong
                >₱{{
                  (
                    (productToEdit?.quantity || 0) * (productToEdit?.price || 0) +
                    additionalTotalPrice
                  ).toLocaleString()
                }}</strong
              >
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="px-8 pb-6 pt-0 d-flex ga-3 justify-end">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="dlg-cancel-btn"
            @click="updateStockDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            class="dlg-confirm-btn"
            rounded="lg"
            elevation="0"
            color="success"
            @click="confirmStockUpdate"
            :disabled="
              !additionalQuantity ||
              additionalQuantity <= 0 ||
              !additionalPricePerUnit ||
              additionalPricePerUnit <= 0
            "
          >
            <v-icon start size="18">mdi-check</v-icon>
            Confirm Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add / Edit Product Dialog -->
    <v-dialog v-model="dialog" max-width="580px" persistent>
      <v-card class="dlg-card" rounded="xl" elevation="12">
        <div class="dlg-header px-8 py-6">
          <div class="d-flex align-center ga-3">
            <v-icon size="26" color="white">{{
              isEditMode ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'
            }}</v-icon>
            <span class="dlg-title">{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</span>
          </div>
        </div>

        <v-card-text class="px-8 py-6">
          <v-form ref="productFormRef" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="productForm.name"
                  label="Product Name"
                  :rules="nameRules"
                  variant="outlined"
                  class="form-field"
                  prepend-inner-icon="mdi-food-variant"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="!isEditMode">
                <v-text-field
                  v-model="productForm.purchaseDate"
                  label="Purchase Date"
                  type="date"
                  variant="outlined"
                  class="form-field"
                  prepend-inner-icon="mdi-calendar-outline"
                  density="comfortable"
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
                  density="comfortable"
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
                  density="comfortable"
                  placeholder="kg, pcs, L..."
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
                  density="comfortable"
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
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-8 pb-6 pt-0 d-flex ga-3 justify-end">
          <v-btn variant="outlined" rounded="lg" class="dlg-cancel-btn" @click="closeDialog"
            >Cancel</v-btn
          >
          <v-btn
            class="dlg-confirm-btn"
            rounded="lg"
            elevation="0"
            @click="saveProduct"
            :disabled="!valid"
          >
            <v-icon start size="18">{{
              isEditMode ? 'mdi-content-save-outline' : 'mdi-plus'
            }}</v-icon>
            {{ isEditMode ? 'Save Changes' : 'Add Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="460px">
      <v-card class="dlg-card" rounded="xl" elevation="12">
        <v-card-text class="px-8 pt-10 pb-6 text-center">
          <div class="delete-icon-wrap mb-5">
            <v-icon size="36" color="error">mdi-trash-can-outline</v-icon>
          </div>
          <p class="delete-title mb-2">Delete Product?</p>
          <p class="delete-name mb-2">{{ productToDelete?.name }}</p>
          <p class="delete-sub">This action is permanent and cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="px-8 pb-8 d-flex ga-3 justify-center">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="dlg-cancel-btn"
            style="min-width: 130px"
            @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            style="min-width: 130px"
            class="font-weight-bold"
            @click="confirmDelete"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Deduct Product Dialog -->
    <v-dialog v-model="deductDialog" max-width="580px" persistent>
      <v-card class="dlg-card" rounded="xl" elevation="12">
        <div class="dlg-header dlg-header--red px-8 py-6">
          <div class="d-flex align-center ga-3">
            <v-icon size="26" color="white">mdi-minus-circle-outline</v-icon>
            <span class="dlg-title">Deduct Product</span>
          </div>
        </div>

        <v-card-text class="px-8 py-6">
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedProductId"
                  :items="products"
                  item-title="name"
                  item-value="id"
                  label="Select Product"
                  variant="outlined"
                  class="form-field"
                  prepend-inner-icon="mdi-magnify"
                  density="comfortable"
                  hide-details="auto"
                >
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="`${item.raw.quantity} ${item.raw.unit} · ${item.raw.purchaseDate}`"
                    ></v-list-item>
                  </template>
                  <template #selection="{ item }">
                    <span v-if="item.raw"
                      >{{ item.raw.name }} ({{ item.raw.quantity }} {{ item.raw.unit }})</span
                    >
                  </template>
                </v-select>
                <p class="text-caption text-grey mt-1">
                  {{ products.length }} product(s) available
                </p>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="deductQuantity"
                  type="number"
                  label="Quantity to Deduct"
                  variant="outlined"
                  class="form-field"
                  prepend-inner-icon="mdi-counter"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-8 pb-6 pt-0 d-flex ga-3 justify-end">
          <v-btn variant="outlined" rounded="lg" class="dlg-cancel-btn" @click="closeDeductDialog"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            class="font-weight-bold"
            @click="submitDeduct"
            :disabled="!selectedProductId || deductQuantity <= 0"
          >
            <v-icon start size="18">mdi-minus</v-icon>
            Deduct
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* ── Base ── */
.app-background {
  background: #f4f5f7;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Header ── */
.header-bar {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(139, 0, 0, 0.18);
}
.header-inner {
  background: linear-gradient(120deg, #7b0000 0%, #b71c1c 60%, #c62828 100%);
}
.header-icon-wrap {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.header-eyebrow {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
}
.header-title {
  color: #fff;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin: 0;
}
.action-header-btn {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #8b0000 !important;
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  text-transform: none !important;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease;
}
.action-header-btn:hover {
  background: #fff !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-1px);
}
.refresh-btn {
  color: rgba(255, 255, 255, 0.8) !important;
}
.refresh-btn:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.12) !important;
}

/* ── Stat Cards ── */
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
}
.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-blue {
  background: linear-gradient(135deg, #1565c0, #1976d2);
}
.stat-red {
  background: linear-gradient(135deg, #8b0000, #c62828);
}
.stat-green {
  background: linear-gradient(135deg, #2e7d32, #388e3c);
}
.stat-label {
  color: #888;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0 0 2px;
}
.stat-value {
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
}
.stat-value--sm {
  font-size: 1.05rem;
}

/* ── Table Card ── */
.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.table-card-header {
  background: #fff;
}
.table-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.count-chip {
  background: #f0f0f0 !important;
  color: #555 !important;
  font-weight: 600;
  font-size: 0.72rem;
}
.tip-alert {
  font-size: 0.78rem;
  max-width: 460px;
  padding: 6px 12px !important;
}

/* ── Table ── */
.table-wrap {
  overflow-x: auto;
}
.product-table {
  width: 100%;
}

.th-cell {
  background: #fafafa !important;
  color: #555 !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.8px !important;
  text-transform: uppercase !important;
  padding: 14px 20px !important;
  border-bottom: 2px solid #f0f0f0 !important;
  white-space: nowrap;
}

.td-row {
  transition: background 0.15s ease;
}
.td-row:hover {
  background: #fdf5f5 !important;
}
.td-row:not(:last-child) td {
  border-bottom: 1px solid #f5f5f5;
}

.td-cell {
  padding: 14px 20px !important;
  vertical-align: middle;
}

.product-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #8b0000, #c62828);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.product-name-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}
.date-chip {
  font-size: 0.72rem !important;
}
.qty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
}
.qty-ok {
  background: #e8f5e9;
  color: #2e7d32;
}
.qty-low {
  background: #fff3e0;
  color: #e65100;
}
.unit-text {
  color: #888;
  font-size: 0.78rem;
}
.price-text {
  color: #2e7d32;
  font-weight: 600;
  font-size: 0.88rem;
}
.total-text {
  color: #8b0000;
  font-weight: 700;
  font-size: 0.92rem;
}
.tbl-btn {
  border-radius: 8px !important;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
}
.empty-icon-wrap {
  width: 96px;
  height: 96px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}
.empty-sub {
  font-size: 0.875rem;
  color: #888;
}

/* ── Dialogs ── */
.dlg-card {
  border: 1px solid rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.dlg-header {
  background: linear-gradient(120deg, #7b0000, #c62828);
}
.dlg-header--warning {
  background: linear-gradient(120deg, #b71c1c, #e65100);
}
.dlg-header--red {
  background: linear-gradient(120deg, #8b0000, #d32f2f);
}
.dlg-title {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.dlg-cancel-btn {
  color: #555 !important;
  border-color: #ddd !important;
  text-transform: none !important;
  font-weight: 600 !important;
}
.dlg-confirm-btn {
  background: linear-gradient(135deg, #7b0000, #b71c1c) !important;
  color: #fff !important;
  text-transform: none !important;
  font-weight: 700 !important;
}
.dlg-confirm-btn:hover {
  background: linear-gradient(135deg, #9b0000, #c62828) !important;
  box-shadow: 0 4px 16px rgba(139, 0, 0, 0.35) !important;
}

/* Choice cards in edit warning */
.choice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}
.choice-card {
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 18px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.choice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.choice-card--green {
  background: #f1faf2;
  border-color: #a5d6a7;
}
.choice-card--green:hover {
  border-color: #4caf50;
}
.choice-card--blue {
  background: #e8f4fd;
  border-color: #90caf9;
}
.choice-card--blue:hover {
  border-color: #1976d2;
}
.choice-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a1a1a;
  margin: 4px 0 2px;
}
.choice-desc {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

/* Stock summary */
.stock-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 14px 18px;
  border: 1px solid #eee;
}
.stock-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
.stock-summary-row:last-child {
  border-bottom: none;
}
.ss-label {
  font-size: 0.8rem;
  color: #666;
}
.ss-val {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
}
.ss-val--bold {
  color: #8b0000;
  font-weight: 800;
}

.field-section-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #8b0000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cost-today-box {
  background: #f1faf2;
  border: 1px solid #a5d6a7;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cost-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #2e7d32;
}
.cost-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2e7d32;
}

.preview-box {
  background: #f4f5f7;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
}
.preview-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.preview-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #333;
  padding: 4px 0;
  border-bottom: 1px dashed #e0e0e0;
}
.preview-row:last-child {
  border-bottom: none;
}
.preview-row strong {
  color: #8b0000;
}

/* Delete dialog */
.delete-icon-wrap {
  width: 72px;
  height: 72px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid #ffcdd2;
}
.delete-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
}
.delete-name {
  font-size: 1rem;
  font-weight: 700;
  color: #c62828;
}
.delete-sub {
  font-size: 0.82rem;
  color: #888;
}

/* Form fields */
.form-field :deep(.v-field) {
  border-radius: 10px;
  transition: all 0.2s ease;
}
.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}
.total-price-field :deep(.v-field) {
  background: #fff9f9;
}
.total-price-field :deep(.v-field input) {
  font-weight: 700;
  color: #8b0000;
}
</style>
