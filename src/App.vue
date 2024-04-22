<script setup lang="ts">

import { RouterView } from 'vue-router';
import { useState } from '@/stores/state';
import { useAuth } from './stores/auth';
import server from './lib/Server';
import router from './router';
import Button from '@/components/Button.vue';

const state = useState();
const auth = useAuth();

async function logout() {
  await server.logout();
  router.push({ name: "login" });
}

function dashboard() {
  router.push({ name: "dashboard" });
}

</script>

<template>
  <div class="App">
    <div class="header">
      <span v-if="state.loading > 0">loading...</span>
      <span class="error" v-if="state.error">{{ state.error }}</span>
      <template v-if="auth.auth">
        <Button @click="dashboard()"><span>Dashboard <i class="fa-solid fa-house"></i></span></Button>
        <Button :disabled="true"><span class="username">{{ auth.user?.username }} <i class="fa-solid fa-user"></i></span></Button>
        <Button @click="logout()"><span>Logout <i class="fa-solid fa-right-from-bracket"></i></span></Button>
      </template>
    </div>

    <RouterView class="RouterView"></RouterView>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.App {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;


  .header {
    width: 100%;
    display: flex;
    gap: dimens.$padding;
    align-items: center;
    justify-content: center;
    padding: dimens.$padding;

    .space {
      flex-grow: 2;
    }

    .error {
      color: #ff0000;
    }
  }

  > .RouterView {
    height: 100%;
    width: 100%;
  }
}

</style>
