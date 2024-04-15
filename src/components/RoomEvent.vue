<script setup lang="ts">
import type { RoomEvent } from '@/lib/Bridge';


const props = defineProps<{
    data: RoomEvent
}>();

</script>

<template>
<div class="container">
    <span>{{ data.created }}</span>
    <span>{{ data.data }}</span>
</div>
</template>

<style scoped lang="scss">

</style>