<template>
    <button
        :type="buttonType"
        class="primary-button"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'PrimaryButton',
    props: {
        buttonType: {
            type: String,
            default: 'button',
        }
    }
}
</script>
