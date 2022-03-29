<template>
    <svg
        viewBox="0 0 11 10"
        :width="size"
        :height="size"
        class="plus-icon"
    >
        <path d="M6.04245 2.24923e-07L4.95755 0V4.45755L0.5 4.45755V5.54245H4.95755V10H6.04245L6.04245 5.54245H10.5V4.45755H6.04245L6.04245 2.24923e-07Z" />
    </svg>
</template>

<script>
    export default {
        name: 'PlusIcon',
        props: {
            size: {
                type: [Number, String],
                default: 10
            }
        }
    }
</script>
