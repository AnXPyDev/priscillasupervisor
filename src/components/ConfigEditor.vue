<script setup lang="ts">
import { ref, watch } from 'vue';
import { useState } from '@/stores/state';
import Button from '@/components/Button.vue';

const state = useState();

const editor_text = defineModel<string>();

const show_editor = ref<boolean>(false);

interface Listing {
    name?: string,
    description?: string,
    path: string,
    template_path: string
}

interface ConfigMetadata {
    variables?: {
        [key: string]: {
            name?: string,
            description?: string,
            type?: string,
            default?: string
        }
    }
}

const listings = ref<Listing[]>([]);
const config = ref<ConfigMetadata>();
const config_template = ref<string>("");

const variables = ref<{[key: string]: string}>({});


async function loadListing() {
    listings.value = await (await fetch(import.meta.env.BASE_URL + "configs/listing.json")).json();
}

async function loadConfig(listing: Listing) {
    config.value = await (await fetch(import.meta.env.BASE_URL +  `configs/${listing.path}`)).json();
    config_template.value = await (await fetch(import.meta.env.BASE_URL + `configs/${listing.template_path}`)).text();
    variables.value = {};
    editor_text.value = config_template.value;
}

function applyVariables() {
    const cfg = config.value!!;
    let text = config_template.value!!;
    const values = variables.value;
    cfg.variables!!;
    for (const varname in cfg.variables) {
        const variable = cfg.variables[varname];
        let value = values[varname];
        if (!value) {
            if (variable.default == undefined) {
                state.error = `Missing value for variable ${variable.name || varname}`
                return;
            }
            value = variable.default;
        }
        text = text.replace(`%%${varname}%%`, value);
    }
    editor_text.value = text;
}

const selected_config = ref<number>(-1);

watch(selected_config, (value) => {
    if (value != -1) {
        loadConfig(listings.value[selected_config.value!!]);
    } else {
        config.value = undefined;
        editor_text.value = "";
    }
});


loadListing();

</script>

<template>
    <div class="ConfigEditor">
        <div class="selection-container">
            <span>Select template</span>
            <select v-model="selected_config">
                <option selected="true" :value="-1">None</option>
                <option v-for="listing, index in listings" :value="index">{{ listing.name || listing.path }}</option>
            </select>
        </div>

        <div v-if="config?.variables" class="variables-container">
            <div class="variable" v-for="variable, varname in config.variables">
                <div class="info">
                    <span class="name">{{ variable.name || varname }}</span>
                    <span class="description" v-if="variable.description">{{ variable.description }}</span>
                </div>
                <input type="text" :placeholder="variable.default" v-model="variables[varname]"> 
            </div>
            <Button @click="applyVariables">Apply Variables <i class="fa-solid fa-check"></i></Button>
        </div>
        <Button @click="show_editor = !show_editor">{{ show_editor ? "Hide editor" : "Show editor" }} <i class="fa-solid fa-eye"></i></Button>
        <textarea v-if="show_editor" spellcheck="false" class="editor" v-model="editor_text">
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

    .variables-container {
        display: flex;
        flex-direction: column;
        gap: dimens.$padding;
        align-items: center;
        width: 100%;

        .variable {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .info {
                min-width: 40%;
                
                .description {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.8em;
                }

            }

            input {
                width: 100%;
            }
        }
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
