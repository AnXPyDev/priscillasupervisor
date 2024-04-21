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
    background-color: var(--clr-bg-2);

    > div {
        padding: dimens.$padding;
    }

    > .time {
        background-color: var(--clr-bg-3);    
    }

    > .message {
        width: 100%;
    }
}
</style>