<template>
    <div :class="['row-center', 'loader-' + size]">
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            style="background: none;"
            class="loader"
        >
            <circle
                cx="50"
                cy="50"
                fill="none"
                stroke-linecap="round"
                r="40"
                stroke-width="6"
                :stroke="loaderColor"
                stroke-dasharray="62.83185307179586 62.83185307179586"
                transform="rotate(293.931 50 50)"
            >
                <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
            </circle>
        </svg>
    </div>
</template>

<script>
    /* size: normal, small, mini */
    export default {
        name: 'Loader',
        props: {
            size: {
                type: String,
                default: 'normal'
            },
            loaderColor: {
                type: String,
                default: '#4eac8f'
            }
        }
    }
</script>
