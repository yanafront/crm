<template>
    <button
        :type="buttonType"
        class="small-border-button"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'SmallBorderButton',
    props: {
        buttonType: {
            type: String,
            default: 'button',
        }
    }
}
</script>
