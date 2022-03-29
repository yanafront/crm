<template>
    <svg
        viewBox="0 0 96 96"
        :width="width"
        :height="height"
        :style="{ transform: `rotate(${transform}deg)` }"
        class="arrow-shewron"
    >
        <path d="M69.8437,43.3876,33.8422,13.3863a6.0035,6.0035,0,0,0-7.6878,9.223l30.47,25.39-30.47,25.39a6.0035,6.0035,0,0,0,7.6878,9.2231L69.8437,52.6106a6.0091,6.0091,0,0,0,0-9.223Z"/>
    </svg>
</template>

<script>
    export default {
        name: "ArrowShewron",
        props: {
            width: {
                type: [Number, String],
                default: 16
            },
            height: {
                type: [Number, String],
                default: 16
            },
            transform: {
                type: [Number, String],
                default: 0
            }
        }
    }
</script>

