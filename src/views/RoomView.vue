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
            <div class="room-name">
                <span class="header">Room {{ room.id }}</span>
                <span class="name">{{ room.name }}</span>
            </div>
            <div class="join-code">
                <span class="header">Join Code</span>
                <span class="name">{{ room.join_code }}</span>
            </div>

        </div>
        <div class="clients-container">
            <span>Clients</span>
            <ClientComponent class="Client" v-for="client in clients" :key="client.id" :data="client" @click="selectClient(client)"/>
        </div>
        <div class="room-events">
            <span>Room events</span>
            <RoomEventComponent class="RoomEvent" v-for="room_event in room_events.slice().reverse()" :key="room_event.id" :data="room_event"/>
        </div>
    </div>

    <div class="right">
        <ClientDetails v-if="selected_client" :room="room" :data="selected_client" :key="selected_client.id"/>
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

    > div {
        @include mixins.box;
        justify-content: start;
        padding: 0;

    }

    .main-header {
        @include mixins.box;
        flex-direction: row;
        padding: 0;
        width: 100%;
        
        > div {
            @include mixins.box;
            background-color: var(--clr-bg-1);
            flex-grow: 2;
        }
    }

    .clients-container, .room-events {
        @include mixins.box;
        background-color: var(--clr-bg-1);
        width: 100%;
    }

    .Client {
        width: 100%;
    }
}



</style>
