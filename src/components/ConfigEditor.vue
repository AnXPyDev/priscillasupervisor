<script setup lang="ts">
import { ref, watch } from 'vue';

const editor_text = defineModel<string>();

const configs = ref<string[]>();

async function loadListing() {
    configs.value = await (await fetch(import.meta.env.BASE_URL + "configs/listing.json")).json();
}

async function loadConfig(name: string) {
    editor_text.value = await (await fetch(import.meta.env.BASE_URL + `configs/${name}`)).text();
}

const selected_config = ref<string>();

watch(selected_config, (value) => {
    if (value) {
        loadConfig(value);
    }
});


loadListing();

</script>

<template>
    <div class="ConfigEditor">
        <div class="selection-container">
            <span>Select template</span>
            <select v-model="selected_config">
                <option v-for="name in configs" :value="name">{{ name }}</option>
            </select>
        </div>
        <textarea spellcheck="false" class="editor" v-model="editor_text">
        </textarea>
    </div>
</template>

<style scoped lang="scss">
@use '@/styles/lib/dimens';
@use '@/styles/lib/mixins';

.ConfigEditor {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: dimens.$padding;

    .selection-container {
        display: flex;
        gap: dimens.$padding;
    }

    textarea {
        @include mixins.input;
        font-family: monospace;
        height: 500px;
        width: 100%;
        font-size: 1em;
    }
}
</style>