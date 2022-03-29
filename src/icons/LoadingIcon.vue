<template>
    <svg
        viewBox="0 0 100 100"
        :width="width"
        :height="height"
        class="loading"
    >
        <circle
            cx="84"
            cy="50"
            r="0"
            style="animation-play-state: running; animation-delay: 0s;"
        >
            <animate
                attributeName="r"
                values="10;0;0;0;0"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
            <animate
                attributeName="cx"
                values="84;84;84;84;84"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
        </circle>
        <circle
            cx="16"
            cy="50"
            r="6.39266"
            style="animation-play-state: running; animation-delay: 0s;"
        >
            <animate
                attributeName="r"
                values="0;10;10;10;0"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="-0.75s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
            <animate
                attributeName="cx"
                values="16;16;50;84;84"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="-0.75s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
        </circle>
        <circle
            cx="84"
            cy="50"
            r="3.60734"
            style="animation-play-state: running; animation-delay: 0s;"
        >
            <animate
                attributeName="r"
                values="0;10;10;10;0"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="-0.375s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
            <animate
                attributeName="cx"
                values="16;16;50;84;84"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="-0.375s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
        </circle>
        <circle
            cx="71.735"
            cy="50"
            r="10"
            style="animation-play-state: running; animation-delay: 0s;"
        >
            <animate
                attributeName="r"
                values="0;10;10;10;0"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
            <animate
                attributeName="cx"
                values="16;16;50;84;84"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
        </circle>
        <circle
            cx="37.735"
            cy="50"
            r="10"
            style="animation-play-state: running; animation-delay: 0s;"
        >
            <animate
                attributeName="r"
                values="0;0;10;10;10"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
            <animate
                attributeName="cx"
                values="16;16;16;50;84"
                keyTimes="0;0.25;0.5;0.75;1"
                keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
                calcMode="spline"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0s"
                style="animation-play-state: running; animation-delay: 0s;"
            />
        </circle>
    </svg>
</template>
<script>
    export default {
        name: 'LoadingIcon',
        props: {
            width: {
                type: [Number, String],
                default: 30
            },
            height: {
                type: [Number, String],
                default: 30
            }
        }
    }
</script>
