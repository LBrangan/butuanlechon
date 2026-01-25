<script setup>
import { onMounted } from 'vue'
import { useReportsStore } from '@/composables/reports'

const reportsStore = useReportsStore()

onMounted(() => {
  reportsStore.getDailyReports()
})
</script>

<template>
  <div class="app-background">
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
          <tr v-for="r in reportsStore.dailyReports" :key="r.report_date">
            <td>{{ r.report_date }}</td>
            <td>₱{{ r.sales.toLocaleString() }}</td>
            <td>₱{{ r.expenses.toLocaleString() }}</td>
            <td :style="{ color: r.profit >= 0 ? 'green' : 'red' }">
              ₱{{ r.profit.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>

<style scoped>
.app-background {
  min-height: 100vh;
}
</style>
