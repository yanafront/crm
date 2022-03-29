<template>
    <button
        :class="[
            'icon-button',
            `icon-button-${color}`
        ]"
        :style="{
            width: `${width}px`,
            height: `${height}px`
        }"
        :type="buttonType"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'IconButton',
    props: {
        buttonType: {
            type: [String],
            default: 'button'
        },
        width: {
            type: [Number, String],
            default: 43
        },
        height: {
            type: [Number, String],
            default: 45
        },
        color: {
            type: [String],
            default: 'green'
        },
    }
}
</script>
