<script setup lang="ts">
import server from '@/lib/Server';
import router from '@/router';
import { useState } from '@/stores/state';
import { ref } from 'vue';
import Button from '@/components/Button.vue';

const room_name = ref<string>("");
const config_name = ref<string>("");
const config_override = ref<string>("");

const error = ref<string | undefined>();

const state = useState();

async function createRoom() {
    try {

        let override: object | undefined;
        if (config_override.value.length != 0) {
            override = JSON.parse(config_override.value);
        }

        const room = await server.createRoom({
            name: room_name.value,
            config: config_name.value,
            config_override: override
        });

        state.room = room;
        
        router.push({ name: "room" });
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message;
        }
    }
}

</script>

<template>
    <div class="RoomCreatorView">
        <span>Name</span>
        <input v-model="room_name"></input>
        <span>Config</span>
        <input v-model="config_name"></input>
        <span>Config Override</span>
        <textarea class="override" v-model="config_override"></textarea>
        <Button @click="createRoom()">create room</Button>
        <span v-if="error" class="error">{{ error }}</span>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
.RoomCreatorView {
    width: max(200px, 30vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding-small;

    .override {
        font-family: monospace;
    }

    .error {
        color: red;
    }
}
</style>