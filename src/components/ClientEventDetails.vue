<script setup lang="ts">
import { Severity } from '@/lib/Bridge';
import { computed } from 'vue';


const props = defineProps<{
    data: string
}>();

const data_obj = computed<object>(() => {
    return JSON.parse(props.data);
});


const value_pairs = computed(() => {
    const data = data_obj.value as any;

    const results: { key: string, value: string }[] = [];

    for (const key in data) {
        const value = data[key]
        if (key == "data") {
            for (const key2 in value) {
                results.push({
                    key: key2, value: JSON.stringify(value[key2], null, 2)
                });
            }
            continue;
        } else if (key == "severity") {
            results.push({
                key, value: Severity[value] 
            });
        } else {
            results.push({
                key: key, value: JSON.stringify(value, null, 2)
            });
        }
    }

    return results;
});

</script>

<template>
    <div class="ClientEventDetails">
        <span v-for="pair in value_pairs">"{{ pair.key }}": {{ pair.value }}</span>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';

.ClientEventDetails {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: dimens.$padding;

    font-family: monospace;

    > span {
        width: 100%; 
        text-align: left;
    }

}
</style>