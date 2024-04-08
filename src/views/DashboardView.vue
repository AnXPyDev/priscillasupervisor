<script setup lang="ts">
import type Room from '@/lib/Room';
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
    <div class="container">
    <h1>dashboard</h1>

    <div class="rooms">
        <div v-for="room in rooms" class="room">
            <span>{{ room.id }} {{ room.name }}</span>
            <button @click="watchRoom(room)">watch</button>
        </div>
    </div>    

    <button @click="openCreator()">create room</button>
    </div>
</template>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: start;

        .rooms {
            display: flex;
            flex-direction: column;
            align-items: start;
            .room {
                display: flex;
                align-items: center;
            }
        }
    }
</style>