<script setup lang="ts">
import server from '@/lib/Server';
import router from '@/router';
import { useState } from '@/stores/state';
import { ref } from 'vue';

const room_name = ref<string>("");
const config_name = ref<string>("");

const error = ref<string | undefined>();

const state = useState();

async function createRoom() {
    try {
        const room = await server.createRoom({
            name: room_name.value,
            config: config_name.value
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
        <button @click="createRoom()">create room</button>
        <h2 v-if="error" class="error">{{ error }}</h2>
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

    .error {
        color: red;
    }
}
</style>