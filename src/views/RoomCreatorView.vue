<script setup lang="ts">
import server from '@/lib/Server';
import router from '@/router';
import { useState } from '@/stores/state';
import { ref } from 'vue';
import Button from '@/components/Button.vue';
import ConfigEditor from '@/components/ConfigEditor.vue';

const room_name = ref<string>("");
const config = ref<string>("");

const error = ref<string | undefined>();

const state = useState();

async function createRoom() {
    try {

        JSON.parse(config.value);

        const room = await server.createRoom({
            name: room_name.value,
            config: config.value
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
        <ConfigEditor class="ConfigEditor" v-model="config"></ConfigEditor>
        <Button @click="createRoom()">create room</Button>
        <span v-if="error" class="error">{{ error }}</span>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';
.RoomCreatorView {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding-small;

    input {
        @include mixins.input;
        padding: dimens.$padding-small;
        font-size: 0.8em;
    }

    .ConfigEditor {
        width: max(700px, 50vw);
    }

    .override {
        font-family: monospace;
    }

    .error {
        color: red;
    }
}
</style>