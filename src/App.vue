<script setup lang="ts">

import { RouterView } from 'vue-router';
import { useState } from '@/stores/state';
import { useAuth } from './stores/auth';
import server from './lib/Server';
import router from './router';

const state = useState();
const auth = useAuth();

async function logout() {
  await server.logout();
  router.push({ name: "login" });
}

</script>

<template>
  <div class="container">
    <div class="header">
      <span v-if="state.loading > 0">loading...</span>
      <span v-if="auth.auth">logged in as {{ auth.user?.username }}</span>
      <button v-if="auth.auth" @click="logout()">logout</button>
    </div>

    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="scss">

.container {
  display: flex;
  align-items: start;
  flex-direction: column;

  .header {
    display: flex;
    gap: 20px;
    align-items: center;
  }
}

</style>
