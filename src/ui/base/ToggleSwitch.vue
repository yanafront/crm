<template>
    <label class="toggle-switch">
        <slot name="default"></slot>
        <span
            :class="[
                'toggle-switch-field relative w-100 h-100',
                `toggle-switch-${color}`
            ]"
        />
    </label>
</template>

<script>
    export default {
        name: 'ToggleSwitch',
        props: {
            color: {
                type: String,
                default: 'green'
            }
        }
    }
</script>
