<script setup lang="ts">
import server from '@/lib/Server';
import { useState } from '@/stores/state';
import { onUnmounted, ref } from 'vue';

const state = useState();

const room = state.room;

const error = ref<string | undefined>();

let last_room_event_id = -1;
let last_client_event_id = -1;

let events = ref<string[]>([]);

let updateTimeout: number | undefined;

function addEvents(data: any) {
    const newEvents: string[] = [];

    const room_events = data.room_events as {id: number, created: string, data: string }[];
    if (room_events.length > 0) {
        for (const room_event of room_events) {
            newEvents.push(`RE ${room_event.created} ${room_event.data}`);
        }

        last_room_event_id = room_events[room_events.length - 1].id;
    }
    
    const client_events = data.client_events as {id: number, client_id: number, created: string, data: string }[];
    if (client_events.length > 0) {
        for (const client_event of client_events) {
            newEvents.push(`CE ${client_event.client_id} ${client_event.created} ${client_event.data}`);
        }

        last_client_event_id = client_events[client_events.length - 1].id;
    }

    if (newEvents.length > 0) {
        events.value = events.value.concat(newEvents);
    }
}

const updateEvents = async () => {
    try {
        const data = await server.getEvents({
            watch_code: room!!.watch_code,
            last_room_event_id, last_client_event_id
        });

        addEvents(data);
    } catch(e) {
        console.error(e);
        if (e instanceof Error) {
            error.value = e.message;
        }
    }
    updateTimeout = setTimeout(updateEvents, 1000);
};

if (room) {
    updateEvents();
}

onUnmounted(() => {
    clearTimeout(updateTimeout);
})


</script>

<template>
    <div v-if="room">
        <span>{{ room.name }} {{ room.id }} JC: {{ room.join_code }} WC: {{ room.watch_code }}</span>
        <div class="eventlist">
            <span v-for="event in events.slice().reverse()">{{ event }}</span>
        </div>
    </div>
    <div v-else>
        <span>Failed to load room</span>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
</template>

<style scoped lang="scss">

.eventlist {
    display: flex;
    flex-direction: column;
}

.error {
    color: red;
}

</style>
