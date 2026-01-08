<script setup>
import { reactive } from 'vue'
import { useProducts } from '@/composables/useProducts'
import NavigationDrawer from '@/components/layout/navigation/Navigation.vue'

const { products, lowStockProducts, deductMultipleProducts } = useProducts()

// reactive object to store daily usage inputs
const usage = reactive({})

// submit function
const submitUsage = () => {
  const usageArray = []

  for (const id in usage) {
    if (usage[id] > 0) {
      usageArray.push({
        productId: Number(id),
        quantity: usage[id]
      })
    }
  }

  if (!usageArray.length) {
    alert('Please input usage before submitting')
    return
  }

  deductMultipleProducts(usageArray)

  // reset input fields
  for (const key in usage) usage[key] = 0
}
</script>

<template>
  <!-- NO <v-app> HERE — sidebar handled by Dashboard layout -->
  <NavigationDrawer />

  <v-main>
    <v-container fluid class="pa-6 daily-bg">
      <!-- Page Header -->
      <v-card class="mb-6 header-card" elevation="6">
        <v-card-title class="header-title">
          <v-icon class="mr-3">mdi-clipboard-check-outline</v-icon>
          Daily Product Usage
        </v-card-title>
        <v-card-subtitle class="header-subtitle">
          Input today’s ingredient consumption
        </v-card-subtitle>
      </v-card>

      <!-- Usage Table -->
      <v-card elevation="8" class="table-card">
        <v-table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Used Today</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td class="fw-600">{{ p.name }}</td>
              <td>{{ p.quantity }}</td>
              <td style="max-width: 140px">
                <v-text-field
                  v-model.number="usage[p.id]"
                  type="number"
                  min="0"
                  density="compact"
                  variant="outlined"
                  placeholder="0"
                  hide-details
                />
              </td>
              <td>
                <v-chip
                  v-if="lowStockProducts.includes(p)"
                  color="red-darken-2"
                  variant="tonal"
                  size="small"
                >
                  Low Stock
                </v-chip>

                <v-chip
                  v-else
                  color="green-darken-2"
                  variant="tonal"
                  size="small"
                >
                  OK
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-divider />

        <!-- Action Button -->
        <v-card-actions class="justify-end pa-6">
          <v-btn
            color="red-darken-2"
            size="large"
            prepend-icon="mdi-minus-circle-outline"
            @click="submitUsage"
          >
            Deduct Daily Usage
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<style scoped>
.daily-bg {
  background: #f7f7f7;
  min-height: 100%;
}

/* Header Card */
.header-card {
  background: linear-gradient(90deg, #8B0000 0%, #A52A2A 100%);
  border-radius: 18px;
  color: white;
}

.header-title {
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.85);
  margin-left: 48px;
}

/* Table Card */
.table-card {
  border-radius: 20px;
  background: #fff;
}

th {
  font-weight: 700;
  color: #8B0000;
}

.fw-600 {
  font-weight: 600;
}
</style>
