<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(true);
const items = ref([
  { title: 'Home', prependIcon: 'mdi-home', active: false },
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


<template> 
  <v-navigation-drawer
    :model-value="drawer"
   color="#C62828"
    >
  

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

    <template #append>
      <v-list-item
        class="ma-2"
        link
        nav
        prepend-icon="mdi-cog-outline"
        title="Settings"
      />
    </template>
  </v-navigation-drawer>


    <v-app-bar border="b" class="ps-4" flat color="#C62828" >
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title>BL & SG Administrative Panel</v-app-bar-title>

    <template #append>
      <div class="search-box">
            <v-icon size="20" class="mr-5 text-grey-lighten-5">mdi-magnify</v-icon>
            <input v-model="searchQuery" type="text" placeholder="Search here... " class="search-input" />
          </div>
      <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

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

.search-input::placeholder {
  color: white; 
  opacity: 1; 
}


.search-input {
  color: white;
  background: none; 
  border: none;
  width: 100%;
  outline: none
}

.search-box {
    /* Example background color to show context for why white text is needed */
    background-color: #E53935; 
    padding: 8px 16px;
    margin: 0 60px;
    
    display: flex;
    align-items: center;
    border-radius: 4px;
}
</style>



