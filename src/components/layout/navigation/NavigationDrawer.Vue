
<template>
  <v-navigation-drawer v-model="drawer" permanent width="280" class="elevation-2" color="white">
    <!-- Logo Section -->
    <v-list-item class="px-6 py-6">
      <template v-slot:prepend>
        <v-icon color="red darken-2" size="40" class="mr-3">mdi-silverware-fork-knife</v-icon>
      </template>
      <v-list-item-title>
        <div>
          <div class="text-h5 font-weight-bold text-red-darken-2">BL & SG</div>
          <div class="text-body-1 text-grey-darken-1">Restaurant</div>
          <div class="text-body-2 text-grey">Inventory System</div>
        </div>
      </v-list-item-title>
    </v-list-item>
    <v-divider class="mx-4"></v-divider>
    <!-- Navigation Menu -->
    <v-list nav density="compact" class="pt-6">
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :class="{ 'bg-red-lighten-5': item.active }"
        class="mb-2 mx-4 rounded-lg"
        @click="$emit('setActiveItem', item.title)"
      >
        <template v-slot:prepend>
          <v-icon :color="item.active ? 'red-darken-2' : 'grey-darken-1'" size="24" class="mr-3">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title
          :class="item.active ? 'text-red-darken-2 font-weight-medium' : 'text-grey-darken-1'"
          class="text-body-1"
        >
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- User Profile and Logout -->
    <template v-slot:append>
      <div class="pa-4">
        <v-divider class="mb-4"></v-divider>
        <v-list>
          <v-list-item class="px-4">
            <template v-slot:prepend>
              <v-avatar color="red-lighten-2" size="40">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">Admin</v-list-item-title>
            <template v-slot:append>
              <v-btn
                icon="mdi-logout"
                variant="text"
                color="red-darken-2"
                @click="$emit('logout')"
                size="small"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
defineProps({
  drawer: Boolean,
  menuItems: Array,
})
defineEmits(['setActiveItem', 'logout'])
</script>

<style scoped>
/* Active sidebar item */
.v-list-item.bg-red-lighten-5 {
  background-color: rgba(255, 205, 210, 0.3) !important;
  border-left: 4px solid #c62828 !important;
}
</style>
