<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(true);
const items = ref([
  { title: 'Home', prependIcon: 'mdi-home', active: true },
  { title: 'Products', prependIcon: 'mdi-information-outline', active: false },
  { title: 'Report', prependIcon: 'mdi-file-chart-outline', active: false },
]);

const setActiveItem = (title) => {
  items.value.forEach(item => {
    item.active = (item.title === title)
  });
  
  if (title === 'Home') {
    router.push('/dashboard');
  } else if (title === 'Products') {
    router.push('/products');
  } else if (title === 'Report') {
    router.push('/report');
  }
}
</script>


<template >
  <v-navigation-drawer
    :model-value="drawer">
  

    <!-- Logo Section -->
    <v-list-item class="mx-4 my-5">
      <template v-slot:prepend>
        <v-avatar size="180">
          <v-img src="/images/Icon.png" alt="BL & SG Logo" />
        </v-avatar>
      </template>
      
    </v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.prependIcon"
        :title="item.title"
        :active="item.active"
        link
        @click="setActiveItem(item.title)"
        class="ma-2"
      />
    </v-list>

    <template>
      <v-list-item
        class="ma-2"
        link
        nav
        prepend-icon="mdi-cog-outline"
        title="Settings"
        
        
      />
    </template>
  </v-navigation-drawer>


    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title>BL & SG Administrative Panel</v-app-bar-title>

    <template #append>
      <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      </v-app-bar>  

    

      
</template>

<style scoped>


</style>



