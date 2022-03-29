<template>
    <button
        :type="buttonType"
        class="danger-button"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'DangerButton',
    props: {
        buttonType: {
            type: String,
            default: 'button',
        }
    }
}
</script>
