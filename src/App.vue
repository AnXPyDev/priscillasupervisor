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
  <div class="App">
    <div class="header">
      <span v-if="state.loading > 0">loading...</span>
      <span class="error" v-if="state.error">{{ state.error }}</span>
      <div class="space"></div>
      <span v-if="auth.auth">logged in as {{ auth.user?.username }}</span>
      <button v-if="auth.auth" @click="logout()">logout</button>
    </div>

    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.App {
  display: flex;
  align-items: center;
  flex-direction: column;


  .header {
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: center;
    padding: dimens.$padding;
    background-color: var(--clr-bg-1);

    .space {
      flex-grow: 2;
    }

    .error {
      color: #ff0000;
    }
  }
}

</style>
