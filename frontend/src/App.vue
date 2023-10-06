<template>
  <router-view></router-view>
</template>
<script setup>
import { useStore } from 'vuex';
import { watch } from 'vue';

const store  = useStore();

watch(
  () => store.getters.authUser,
  (user) => {

  },
  { 
    immediate: true,
    deep: true
  }
)
</script>
<style lang="scss">
// Import Main styles for this application
@import '@/assets/styles/style.scss';
</style>
