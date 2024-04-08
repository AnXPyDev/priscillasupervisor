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

<div class="container">
    <h1>login</h1>
    <input v-model="url"></input>
    <input v-model="username"></input>
    <input v-model="password" type="password"></input>
    <button @click="login()">login</button>
    <h2 class="error" v-if="error">{{ error }}</h2>
</div>

</template>

<style scoped lang="scss">

.container {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.error {
    color: red;
}

</style>