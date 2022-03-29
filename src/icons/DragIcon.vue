<template>
    <svg
        viewBox="-335.25 262.75 16.75 30.38"
        :width="size/2"
        :height="size"
        class="drag-icon"
    >
        <rect
            x="-335.25"
            y="262.75"
            width="5.2"
            height="5.2"
        />
        <rect
            x="-335.25"
            y="275.34"
            width="5.2"
            height="5.2"
        />
        <rect
            x="-335.25"
            y="287.93"
            width="5.2"
            height="5.2"
        />
        <rect
            x="-323.7"
            y="262.75"
            width="5.2"
            height="5.2"
        />
        <rect
            x="-323.7"
            y="275.34"
            width="5.2"
            height="5.2"
        />
        <rect
            x="-323.7"
            y="287.93"
            width="5.2"
            height="5.2"
        />
    </svg>
</template>

<script>
    export default {
        name: 'DragIcon',
        props: {
            size: {
                type: [Number, String],
                default: 10
            }
        }
    }
</script>
