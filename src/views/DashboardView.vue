<script setup lang="ts">
import type { Room } from '@/lib/Bridge';
import server from '@/lib/Server';
import router from '@/router';
import { useState } from '@/stores/state';
import { ref } from 'vue';

const state = useState();

function openCreator() {
    router.push({ name: "creator" });
}

const rooms = ref<Room[]>([]);

async function getRooms() {
    try {
        const data = await server.getRooms();
        rooms.value = data.rooms;
    } catch (e) {
        console.error(e);
    }
}

function watchRoom(room: Room) {
    state.room = room;
    router.push({ name: "room" });
}

getRooms();

</script>

<template>
<div class="DashboardView">
    <span class="title">Dashboard</span>
    <div class="rooms">
        <div v-for="room in rooms" class="room">
            <span>{{ room.name }}</span>
            <div class="space"></div>
            <button @click="watchRoom(room)">watch</button>
        </div>
    </div>    

    <button @click="openCreator()">Create Room</button>
</div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.DashboardView {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding;
    padding: dimens.$padding;

    .rooms {
        padding: dimens.$padding;
        display: flex;
        flex-direction: column;
        align-items: start;
        width: fit-content;
        gap: dimens.$padding;
        .room {
            padding: dimens.$padding;
            background-color: var(--clr-bg-1);
            border-radius: dimens.$radius;
            display: flex;
            align-items: center;
            width: 100%;
            gap: 2em;

            .space {
                flex-grow: 2;
            }
        }
    }

    .title {
        padding: dimens.$padding;
        font-size: 2em;
        font-weight: 500;
    }
}
</style>