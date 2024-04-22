<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    active?: boolean
    disabled?: boolean
}>(), {
    active: false,
    disabled: false
});

const active_class = computed<string>(() => {
    return props.active ? "active" : "";
});

const disabled_class = computed<string>(() => {
    return props.disabled ? "disabled" : "";
});

</script>

<template>
    <div class="component_Button Button" :class="active_class + ' ' + disabled_class">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/lib/dimens";

.Button {
    border-radius: dimens.$radius;
    padding: dimens.$padding-small;
    background-color: var(--clr-floating);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    &:not(.disabled):hover {
        background-color: var(--clr-shadow);
        cursor: pointer;
    }

    &.active {
        background-color: var(--clr-bg-2);

        &:hover {
            background-color: var(--clr-bg-hover-2);
        }
    }

}

</style>

<style lang="scss">
.component_Button {
    img {
        object-fit: contain;
        max-width: 100%;
        max-height: 100%;
        color: var(--clr-fg);
    }
}
</style>