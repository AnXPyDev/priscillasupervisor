<script setup lang="ts">

import type { Client, Room, ClientState, ClientEvent } from '@/lib/Bridge';
import ClientManager from '@/lib/ClientManager';
import { computed, onUnmounted, ref } from 'vue';
import ClientEventComponent from './ClientEvent.vue';
import server from '@/lib/Server';
import Button from './Button.vue';

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

function sendAction(action: string) {
    server.post("/user/message", {
        client_id: props.data.id,
        data: JSON.stringify({ action })
    });
}

function unlock() {
    sendAction("unlock");
}

function lock() {
    sendAction("lock");
}

function clearWarning() {
    sendAction("clear_warning");
}

</script>

<template>
<div class="ClientDetails">
    <div class="header">
        <div class="info top-bottom">
            <div class="top">
                <span class="title">Client Details <i class="fa-solid fa-circle-info"></i></span>
            </div>
            <div class="bottom">
                <Button :disabled="true" class="name"><span><i class="fa-solid fa-signature"></i> {{ data.name }}</span></Button>
                <Button :disabled="true" class="ip_address"><span><i class="fa-solid fa-location-dot"></i> {{ data.ip_address }}</span></Button>
            </div>
        </div>

        <div class="controls top-bottom">
            <div class="top">
                <span class="title">Controls <i class="fa-solid fa-sliders"></i></span>
            </div>
            <div class="bottom">
                <Button v-if="state.locked" @click="unlock()"><span>Unlock <i class="fa-solid fa-lock-open"></i></span></Button>
                <Button v-else @click="lock()"><span>Lock <i class="fa-solid fa-lock"></i></span></Button>
                <Button v-if="state.warning" @click="clearWarning()"><span>Clear Warning <i class="fa-solid fa-shield-check"></i></span></Button>
            </div>
        </div>
    </div>

    <div class="state top-bottom">
        <div class="top">
            <span class="title">State <i class="fa-solid fa-chart-line"></i></span>
        </div>
        <div class="bottom">
            <Button v-if="state.disconnected" :disabled="true"><span>Disconnected <i class="fa-solid fa-signal-slash"></i></span></Button>
            <Button v-if="state.debug" :disabled="true"><span>Debug Enabled <i class="fa-solid fa-ban-bug"></i></span></Button>
            <Button v-if="state.locked" :disabled="true"><span>Locked <i class="fa-solid fa-lock"></i></span></Button>
            <Button v-if="state.warning" :disabled="true"><span>Warning <i class="fa-solid fa-triangle-exclamation"></i></span></Button>
        </div>
    </div>

    <div class="events top-bottom">
        <div class="top">
            <span class="title">Events <i class="fa-solid fa-comments"></i></span>
        </div>
        <div class="bottom">
            <ClientEventComponent v-for="event in events.slice().reverse()" :data="event"/>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
@use '@/styles/lib/mixins';
@use '@/styles/lib/dimens';


.ClientDetails {
    @include mixins.box;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    padding: 0;

    .title {
        @include mixins.emphasis;
    }

    .top-bottom {
        @include mixins.top-bottom;
    }


    .events {
        > .bottom {
            display: flex;
            flex-direction: column;
        }
    }

    > .header {
        @include mixins.box;
        padding: 0;
        flex-direction: row;
        align-items: stretch;

        > .top-bottom {
            flex-grow: 2;
        }

    }

}

</style>