<script setup lang="ts">
import type { Client, RoomEvent } from '@/lib/Bridge';
import server from '@/lib/Server';
import { useState } from '@/stores/state';
import { computed, onUnmounted, ref } from 'vue';
import RoomManager from '@/lib/RoomManager';
import ClientComponent from '@/components/Client.vue'
import ClientDetails from '@/components/ClientDetails.vue'
import RoomEventComponent from '@/components/RoomEvent.vue'

const state = useState();

const room = state.room!!;

const error = ref<string | undefined>();

const room_events = ref<RoomEvent[]>([]);
const clients = ref<Client[]>([]);

const room_manager = new RoomManager(room);

room_manager.clientHandler = () => {
    clients.value = room_manager.clients
};

room_manager.roomEventHandler = () => {
    room_events.value = room_manager.room_events
};


const selected_client_id = ref<number>();

const selected_client = computed<Client | undefined>(() => {
    return clients.value.find((client) => client.id == selected_client_id.value);
});

function selectClient(client: Client) {
    selected_client_id.value = client.id;
}

room_manager.start();

onUnmounted(() => {
})

</script>

<template>
<div class="RoomView">
    <div class="left">
        <div class="main-header">
            <div class="room-name top-bottom">
                <div class="top">
                    <span class="title">Room {{ room.id }} <i class="fa-solid fa-screen-users"></i></span>
                </div>
                <div class="bottom">
                    <span class="name">{{ room.name }}</span>
                </div>
            </div>
            <div class="join-code top-bottom">
                <div class="top">
                    <span class="title">Join Code <i class="fa-solid fa-key"></i></span>
                </div>
                <div class="bottom">
                    <span class="name">{{ room.join_code }}</span>
                </div>
            </div>
        </div>
        <div class="clients-container top-bottom">
            <div class="top">
                <span class="title">Clients <i class="fa-solid fa-users"></i></span>
            </div>
            <div class="bottom">
                <ClientComponent class="Client" v-for="client in clients" :key="client.id" :data="client" @click="selectClient(client)"/>
            </div>
        </div>
        <div class="room-events top-bottom">
            <div class="top">
                <span class="title">Room events <i class="fa-solid fa-bell"></i></span>
            </div>
            <div class="bottom">
                <RoomEventComponent class="RoomEvent" v-for="room_event in room_events.slice().reverse()" :key="room_event.id" :data="room_event"/>
            </div>
        </div>
    </div>

    <div class="right">
        <ClientDetails class="ClientDetails" v-if="selected_client" :room="room" :data="selected_client" :key="selected_client.id"/>
    </div>

</div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';


.RoomView {
    @include mixins.box;
    flex-direction: row;
    align-items: start;
    justify-content: center;

    .top-bottom {
        @include mixins.top-bottom;
    }

    .title {
        @include mixins.emphasis;
    }

    > div {
        @include mixins.box;
        justify-content: start;
        padding: 0;
        height: 100%;

    }

    .main-header {
        @include mixins.box;
        flex-direction: row;
        padding: 0;
        width: 100%;
        
        > div {
            background-color: var(--clr-bg-1);
            flex-grow: 2;
        }
    }

    .clients-container, .room-events {
        width: 100%;
    
        > .bottom {
            flex-direction: column;
            width: 100%;
            overflow-y: scroll;
        }
    }

    .room-events {
        //height: 100%;
    }

    .Client {
        width: 100%;
    }

    .ClientDetails {
        height: 100%;
    }
}



</style>
