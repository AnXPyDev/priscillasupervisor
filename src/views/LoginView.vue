<script setup lang="ts">

import server from '@/lib/Server';
import router from '@/router';
import { useAuth } from '@/stores/auth';
import { useConfiguration } from '@/stores/configuration';
import { useState } from '@/stores/state';
import { ref } from 'vue';

const configuration = useConfiguration();
const auth = useAuth();
const state = useState();

const url = ref<string>("http://localhost/supervisor");
const username = ref<string>("");
const password = ref<string>("");
const error = ref<string | undefined>();

async function login() {
    configuration.server_url = url.value;

    state.loading++;

    try {
        await server.connect();
        await server.login(username.value, password.value);
        
        router.push({ name: "dashboard" });
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message;
        }
    }

    state.loading--;
}

</script>

<template>

<div class="LoginView">
    <h1>login</h1>
    <span>Server URL</span>
    <input v-model="url"></input>
    <span>Username</span>
    <input v-model="username"></input>
    <span>Password</span>
    <input v-model="password" type="password"></input>
    <button @click="login()">login</button>
    <h2 class="error" v-if="error">{{ error }}</h2>
</div>

</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.LoginView {
    width: max(200px, 30vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding-small;

    .error {
        color: red;
    }
}


</style>