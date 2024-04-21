<script setup lang="ts">

import type { ClientEvent } from '@/lib/Bridge';
import { formatTime } from '@/lib/time';

const props = defineProps<{
    data: ClientEvent
}>();

</script>

<template>
    <div class="ClientEvent">
        <div class="time">
            {{ formatTime(new Date(data.created)) }}
        </div>
        <div class="message">
            {{ data.data }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
.ClientEvent {
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