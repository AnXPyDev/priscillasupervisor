<script setup lang="ts">

import { computed } from 'vue';
import type { Client, ClientState } from '../lib/Bridge';
import server from '@/lib/Server';

const props = defineProps<{
    data: Client
}>();

const state = computed<ClientState>(() => JSON.parse(props.data.state));


</script>

<template>
    <div class="Client">
        <span class="name"><i class="fa-solid fa-user"></i> {{ data.name }}</span>
        <i v-if="state.locked" class="fa-solid fa-lock"></i>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';

.Client {
    @include mixins.box;
    @include mixins.clickable;

    flex-direction: row;
    background-color: var(--clr-bg-2);
}
</style>