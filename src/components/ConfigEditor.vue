<script setup lang="ts">
import { ref, watch } from 'vue';

const editor_text = defineModel<string>();

const configs = ["priscilla"];


async function loadConfig(name: string) {
    editor_text.value = await (await fetch(`/configs/${name}.json`)).text();
}

const selected_config = ref<string>();

watch(selected_config, (value) => {
    if (value) {
        loadConfig(value);
    }
});

</script>

<template>
    <select v-model="selected_config">
        <option disabled value="">Select Template</option>
        <option v-for="name in configs" :value="name">{{ name }}</option>
    </select>
    <textarea v-model="editor_text">
    </textarea>
</template>

<style scoped lang="scss">

</style>