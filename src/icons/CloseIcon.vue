<template>
    <svg
        viewBox="0 0 12 12"
        :width="size"
        :height="size"
        class="close-icon"
    >
        <path d="M12 1.17447L10.8255 0L6 4.82553L1.17447 0L0 1.17447L4.82553 6L0 10.8255L1.17447 12L6 7.17447L10.8255 12L12 10.8255L7.17447 6L12 1.17447Z" />
    </svg>
</template>

<script>
    export default {
        name: 'CloseIcon',
        props: {
            size: {
                type: [Number, String],
                default: 12
            }
        }
    }
</script>
