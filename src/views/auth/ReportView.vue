<script setup>
import { useProducts } from '@/composables/useProducts'
import NavigationDrawer from '@/components/layout/navigation/Navigation.vue'

const { allReports } = useProducts()
</script>

<template>
  <v-main class="app-background">
    <NavigationDrawer />

    <v-container class="pa-8">
      <h1 class="mb-6">Daily Reports</h1>

      <v-table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Sales</th>
            <th>Expenses</th>
            <th>Profit</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in allReports" :key="r.date">
            <td>{{ r.date }}</td>
            <td>₱{{ r.sales.toLocaleString() }}</td>
            <td>₱{{ r.expenses.toLocaleString() }}</td>
            <td :style="{ color: r.profit >= 0 ? 'green' : 'red' }">
              ₱{{ r.profit.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-main>
</template>

<style scoped>
.app-background {
  min-height: 100vh;
}
</style>
