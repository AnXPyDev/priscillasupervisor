<script setup lang="ts">

import server from '@/lib/Server';
import router from '@/router';
import { useAuth } from '@/stores/auth';
import { useConfiguration } from '@/stores/configuration';
import { useState } from '@/stores/state';
import { ref } from 'vue';
import Button from '@/components/Button.vue';

const configuration = useConfiguration();
const auth = useAuth();
const state = useState();

const url = ref<string>("?https://aplikovanainformatika.sk/_server");
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
    <span class="title">Connect to instance <i class="fa-solid fa-wifi"></i></span>
    <div class="split">
        <div class="left">
            <div><span>Server URL</span></div>
            <div><span>Username</span></div>
            <div><span>Password</span></div>
        </div>
        <div class="right">
            <div><input v-model="url"></input></div>
            <div><input v-model="username"></input></div>
            <div><input v-model="password" type="password"></input></div>
        </div>
    </div>
    <Button @click="login()"><span>Login <i class="fa-solid fa-right-to-bracket"></i></span></Button>
    <h2 class="error" v-if="error">{{ error }}</h2>
</div>

</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';

$padding: dimens.$padding;

.LoginView {
    width: max(200px, 30vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $padding;
    width: 100%;
    height: 100%;
    font-size: 1.2em;

    > .error {
        color: red;
    }

    > .title {
        font-weight: 700;
        font-size: 1.2em;
    }

    > .split {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;

        $split_gap: $padding;

        > div {
            display: flex;
            flex-direction: column;
            gap: $padding;

            > div {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 3em;
            }
        }

        > .left {
            padding-right: calc($split_gap / 2);
        }

        > .right {
            padding-left: calc($split_gap / 2);

            input {
                @include mixins.input;
                width: 20em;
                padding: $padding;
                font-size: 0.8em;
            }
        }
    }
}


</style>