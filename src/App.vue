<script setup>
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <RouterView />
    </template>
  </AppLayout>
</template>
