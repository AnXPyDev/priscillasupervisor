<script setup lang="ts">

import type { ClientEvent } from '@/lib/Bridge';

const props = defineProps<{
    data: ClientEvent
}>();

</script>

<template>
    <div class="ClientEvent">
        {{ data.created }}
        {{ data.data }}
    </div>
</template>