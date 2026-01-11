<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)
const items = ref([
  { title: 'Home', prependIcon: 'mdi-home', active: false },
  { title: 'Products', prependIcon: 'mdi-information-outline', active: false },
  { title: 'Daily Usage', prependIcon: 'mdi-clipboard-check-outline', active: false },
  { title: 'Report', prependIcon: 'mdi-file-chart-outline', active: false },

])

const setActiveItem = (title) => {
  items.value.forEach((item) => {
    item.active = item.title === title
  })

  if (title === 'Home') {
    router.push('/dashboard')
  } else if (title === 'Products') {
    router.push('/products')
  } else if (title === 'Daily Usage') {
    router.push('/daily-usage')
  } else if (title === 'Report') {
    router.push('/report')
  }

}
</script>

<template>
  <v-navigation-drawer :model-value="drawer" class="nav-drawer-red">
    <!-- Logo Section -->
    <v-list-item class="mx-6 my-5">
      <template v-slot:prepend>
        <v-avatar size="160">
          <v-img src="/images/bl.png" alt="BL & SG Logo" />
        </v-avatar>
      </template>
    </v-list-item>

    <v-divider class="red-divider"></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.prependIcon"
        :title="item.title"
        :active="item.active"
        link
        @click="setActiveItem(item.title)"
        class="ma-2 nav-item"
        :class="{ 'nav-item-active': item.active }"
      />
    </v-list>

    <template #append>
      <v-list-item
        class="ma-2 nav-item"
        link
        nav
        prepend-icon="mdi-cog-outline"
        title="Settings"
      />
    </template>
  </v-navigation-drawer>

  <v-app-bar border="b" class="ps-4 app-bar-red" flat>
    <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

    <v-app-bar-title class="app-bar-title">BL & SG Administrative Panel</v-app-bar-title>

    <template #append>
      <div class="search-box">
        <v-icon size="20" class="mr-5 text-white">mdi-magnify</v-icon>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search here... "
          class="search-input"
        />
      </div>
      <v-btn class="text-none me-2" height="48" icon slim>
        <v-avatar
          color="surface-light"
          image="https://cdn.vuetifyjs.com/images/john.png"
          size="32"
        />

        <v-menu activator="parent">
          <v-list density="compact" nav>
            <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

            <v-list-item append-icon="mdi-logout" link title="Logout" @click="router.push('/')" />
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
/* Navigation Drawer - Red Theme */
.nav-drawer-red {
  background: linear-gradient(180deg, #1a0505 0%, #2d0a0a 100%) !important;
  border-right: 1px solid rgba(139, 0, 0, 0.3) !important;
}

/* App Bar - Red Theme */
.app-bar-red {
  background: linear-gradient(90deg, #8B0000 0%, #A52A2A 100%) !important;
  box-shadow: 0 2px 12px rgba(139, 0, 0, 0.3) !important;
}

.app-bar-title {
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Red Divider */
.red-divider {
  border-color: rgba(220, 20, 60, 0.3) !important;
  border-width: 2px;
  margin: 16px 0;
}

/* Navigation Items */
.nav-item {
  color: #FFE4E1 !important;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin: 6px 12px !important;
}

.nav-item:hover {
  background: rgba(139, 0, 0, 0.35) !important;
  transform: translateX(6px);
}

.nav-item-active {
  background: rgba(220, 20, 60, 0.3) !important;
  border-left: 5px solid #DC143C !important;
  font-weight: 700;
  color: white !important;
}

.nav-item-active :deep(.v-icon) {
  color: #DC143C !important;
  transform: scale(1.1);
}

/* Navigation Icons */
.nav-item :deep(.v-icon) {
  color: #FFB6B6 !important;
  transition: all 0.3s ease;
}

.nav-item:hover :deep(.v-icon) {
  color: #FF6B6B !important;
}

/* List Item Title */
.nav-item :deep(.v-list-item-title) {
  font-weight: 500;
  letter-spacing: 0.3px;
  font-size: 0.95rem;
}

/* Search Box */
.search-box {
  background: rgba(255, 255, 255, 0.2) !important;
  padding: 10px 20px;
  margin: 0 60px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.search-box:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5);
}

.search-input {
  color: white;
  background: none;
  border: none;
  width: 100%;
  outline: none;
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.85);
  opacity: 1;
}

/* Avatar Button */
.v-btn :deep(.v-avatar) {
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.v-btn:hover :deep(.v-avatar) {
  border-color: white;
  transform: scale(1.05);
}

/* App Bar Icons */
.app-bar-red :deep(.v-icon),
.app-bar-red :deep(.v-btn) {
  color: white !important;
}
</style>
