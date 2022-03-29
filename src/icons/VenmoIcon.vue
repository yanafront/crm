<template>
    <svg
        viewBox="0 0 10 11"
        :width="width"
        :height="height"
        class="venmo-icon"
    >
        <path d="M7.55011 0.5C7.86067 0.98 8 1.47495 8 2.1C8 4.09344 6.18507 6.68229 4.71204 8.5H1.34853L0 0.936721L2.94607 0.674426L3.66231 6.05593C4.32818 5.0377 5.15157 3.43771 5.15157 2.34761C5.15157 1.75036 5.04246 1.34433 4.87179 1.0099L7.55011 0.5Z" />
    </svg>
</template>
<script>
export default {
    name: 'VenmoIcon',
    props: {
        width: {
            type: [Number, String],
            default: 14
        },
        height: {
            type: [Number, String],
            default: 16
        }
    }
}
</script>
