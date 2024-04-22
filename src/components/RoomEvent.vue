<script setup lang="ts">
import type { RoomEvent } from '@/lib/Bridge';
import { formatTime } from '@/lib/time';


const props = defineProps<{
    data: RoomEvent
}>();

</script>

<template>
<div class="RoomEvent">
    <div class="time">
        <span>{{ formatTime(new Date(data.created)) }}</span>
    </div>
    <div class="message">
        <span>{{ JSON.parse(data.data)['message'] ?? "" }}</span>
    </div>
</div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
.RoomEvent {
    display: flex;
    flex-direction: row;
    width: 100%;
    border-radius: dimens.$padding;
    overflow: hidden;
    background-color: var(--clr-soft-shadow);

    > div {
        padding: dimens.$padding-small;
        padding-inline: dimens.$padding;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    > .time {
        font-family: monospace;
        background-color: var(--clr-soft-shadow);    
        border-radius: dimens.$padding;
        overflow: hidden;
        min-width: 6em;
    }

    > .message {
        width: 100%;
    }
}
</style>