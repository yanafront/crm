<template>
    <button
        :type="buttonType"
        class="border-button"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'BorderButton',
    props: {
        buttonType: {
            type: String,
            default: 'button',
        }
    }
}
</script>
