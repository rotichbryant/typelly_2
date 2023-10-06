<template>
  <div>
    <template v-if="!$isEmpty(authUser)">
      <Sidebar />
      <div class="wrapper d-flex flex-column min-vh-100 bg-light">
        <HeaderNav />
        <div class="body flex-grow-1">
          <CContainer fluid class="min-vh-100">
            <CRow class="h-100">
              <router-view />
            </CRow>
          </CContainer>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>  
</template>
<script setup>
  import { isEmpty } from 'lodash';
  import { useStore } from 'vuex'
  import HeaderNav from '@/components/HeaderNav.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import { computed } from 'vue';

  const $isEmpty = isEmpty;
  const store    = useStore();

  const authUser = computed( () => {
    return store.getters.authUser;
  });
</script>