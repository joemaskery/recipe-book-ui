<template>
  <Menubar class="menubar" />

  <div class="main-content">
    <router-view />
  </div>

  <Toast />
</template>

<script setup>

import Menubar from './components/Menubar.vue';
import Toast from 'primevue/toast'

</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.menubar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.main-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
</style>
