<script setup lang="ts">
import type { Room } from '@/lib/Bridge';
import server from '@/lib/Server';
import router from '@/router';
import { useState } from '@/stores/state';
import { ref } from 'vue';
import Button from '@/components/Button.vue';

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
    <div class="rooms top-bottom">
        <div class="top">
            <span class="title">Rooms <i class="fa-solid fa-screen-users"></i></span>
        </div>
        <div class="bottom">
            <Button class="room" v-for="room in rooms" @click="watchRoom(room)">{{ room.name }}</Button>
        </div>    
        <Button class="create_button" @click="openCreator()"><span>Create Room <i class="fa-solid fa-plus"></i></span></Button>
    </div>
</div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';

.DashboardView {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding;
    padding: dimens.$padding;
    
    .title {
        @include mixins.emphasis;
    }

    .top-bottom {
        @include mixins.top-bottom;
    }

    .rooms {
        min-width: 200px;
        padding: dimens.$padding;
        display: flex;
        flex-direction: column;
        align-items: start;
        width: fit-content;
        gap: dimens.$padding;

        .room {
            padding: dimens.$padding-small;
            padding-inline: dimens.$padding;
            width: 100%;
        }

        > .bottom {
            display: flex;
            flex-direction: column;
            gap: dimens.$padding;
        }

        .create_button {
            width: 100%;
        }
    }


}
</style>