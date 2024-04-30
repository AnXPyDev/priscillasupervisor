<script setup lang="ts">

import { computed } from 'vue';
import type { Client, ClientState } from '../lib/Bridge';
import server from '@/lib/Server';
import Button from './Button.vue';

const props = defineProps<{
    data: Client
}>();

const state = computed<ClientState>(() => JSON.parse(props.data.state));


</script>

<template>
    <Button>
        <div class="container">
            <span class="name">{{ data.name }}</span>
            <div class="states">
                <i v-if="state.disconnected" class="fa-solid fa-signal-slash"></i>
                <i v-if="state.warning" class="fa-solid fa-ban-bug"></i>
                <i v-if="state.locked" class="fa-solid fa-lock"></i>
                <i v-if="state.warning" class="fa-solid fa-triangle-exclamation"></i>
            </div>
        </div>
    </Button>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.container {
    display: flex;
    gap: dimens.$padding;
    padding-inline: dimens.$padding-small;
    width: 100%;

    .states {
        flex-grow: 1;
        display: flex;
        gap: dimens.$padding;
        justify-content: end;
    }
}

</style>