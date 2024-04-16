<script setup lang="ts">

import type { Client, Room, ClientState, ClientEvent } from '@/lib/Bridge';
import ClientManager from '@/lib/ClientManager';
import { computed, onUnmounted, ref } from 'vue';
import ClientEventComponent from './ClientEvent.vue';
import Server from '@/lib/Server';

const props = defineProps<{
    data: Client,
    room: Room
}>();

const state = computed<ClientState>(() => {
    return JSON.parse(props.data.state);
});

const manager = new ClientManager(props.room, props.data.id);

const events = ref<ClientEvent[]>([]);

manager.clientEventHandler = () => {
    events.value = manager.client_events;
}

manager.start();

onUnmounted(() => {
    manager.stop();
});

function unlock() {
    Server.post("/user/sendmessage", {
        client_id: props.data.id,
        data: JSON.stringify({
            action: "unlock"
        })
    });
}

function lock() {
    Server.post("/user/sendmessage", {
        client_id: props.data.id,
        data: JSON.stringify({
            action: "lock"
        })
    });
}

</script>

<template>
<div class="ClientDetails">
    <div class="header">
        <div class="info">
            <div class="top">
                <span class="title">Client Details</span>
            </div>
            <div class="bottom">
                <span class="name">{{ data.name }}</span>
                <span class="ip_address">{{ data.ip_address }}</span>
            </div>
        </div>

        <div class="controls">
            <span v-if="state.locked" @click="unlock()">unlock <i class="fa-solid fa-lock-open"></i></span>
            <span v-else @click="lock()">lock <i class="fa-solid fa-lock"></i></span>
        </div>
    </div>

    <div class="state">
        <span>State:</span>
        <span v-if="state.locked">locked <i class="fa-solid fa-lock"></i></span>
    </div>

    <div class="events">
        <span>Events</span>
        <ClientEventComponent v-for="event in events.slice().reverse()" :data="event"/>
    </div>
</div>
</template>

<style lang="scss" scoped>
@use '@/styles/lib/mixins';

@mixin container {
    @include mixins.box;
    flex-direction: column;
    background-color: var(--clr-bg-1);
    align-items: stretch;
}

.ClientDetails {
    @include mixins.box;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    padding: 0;


    > .state, > .events {
        @include container;
    }

    > .header {
        @include mixins.box;
        padding: 0;
        flex-direction: row;
        align-items: stretch;
        > div {
            @include container;
            display: flex;
            flex-grow: 2;
        }

        > .info > .bottom{
            display: flex;
            flex-direction: row;
            gap: 1em;
        }

        > .controls:empty {
            display: none;
        }
    }

    .state {
        flex-direction: row !important;
    }

    .controls {
       > * {
        @include mixins.clickable;
       } 
    }
}

</style>