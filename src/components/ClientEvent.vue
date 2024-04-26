<script setup lang="ts">

import type { ClientEvent } from '@/lib/Bridge';
import { formatTime } from '@/lib/time';
import { computed, ref } from 'vue';
import ClientEventDetails from '@/components/ClientEventDetails.vue'

const props = defineProps<{
    data: ClientEvent
}>();

const data_obj = computed<object>(() => {
    return JSON.parse(props.data.data);
});

const severity_icons: { [severity: number]: string } = {
    [-2]: "fa-envelope-circle-check",
    [-1]: "fa-star",
    [0]: "fa-circle-info",
    [1]: "fa-triangle-exclamation",
    [2]: "fa-skull",
    [3]: "fa-shield-slash"
}

const severity = computed<number | undefined>(() => {
    const obj: { severity?: number } = data_obj.value;
    return obj.severity;
});

const message = computed<string>(() => {
    const obj: { message?: string } = data_obj.value;
    return obj.message ?? "No message attached";
});

const expanded = ref<boolean>(false);

function toggleExpand() {
    expanded.value = !expanded.value;
}

</script>

<template>
    <div class="ClientEvent">
        <div class="info">
            <div class="header">
                <span class="time">{{ formatTime(new Date(data.created)) }}</span>
                <i v-if="severity !== undefined" class="icon fa-solid" :class="severity_icons[severity] ?? 'fa-question'"></i>
            </div>
            <div class="message">
                <span>{{ message }}</span>
            </div>
            <div class="expand" @click="toggleExpand()">
                <i v-if="expanded" class="fa-solid fa-chevron-down"></i>
                <i v-else class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <ClientEventDetails v-if="expanded" :data="data.data"></ClientEventDetails>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
.ClientEvent {
    width: 100%;
    background-color: var(--clr-soft-shadow);
    border-radius: dimens.$padding;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > .info {
        display: flex;
        width: 100%;
        flex-direction: row;

        > div {
            padding: dimens.$padding-small;
            padding-inline: dimens.$padding;
        }

        > .header {
            background-color: var(--clr-soft-shadow);    
            display: flex;
            flex-direction: row;
            align-items: center;
            font-family: monospace;
            min-width: 8em;
            border-radius: dimens.$padding;
            overflow: hidden;

            .icon {
                text-align: end;
                font-size: 0.8em;
                width: 100%;
            }

        }

        > .message {
            width: 100%;
        }

        > .expand {
            text-align: right;
            width: 2.2em;
            &:hover {
                cursor: pointer;
            }
        }
    }

}
</style>