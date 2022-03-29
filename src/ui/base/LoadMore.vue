<template>
    <button
        class="load-more-button s-align-5"
        :disabled="status"
    >
        <span
            v-if="!status"
            class="f-14-white f-sbold"
        >
            Load More
        </span>
        <loading-icon v-if="status"/>
    </button>
</template>

<script>
import { LoadingIcon } from '@/icons';

export default {
    name: 'LoadMore',
    props: {
        status: {
            type: Boolean,
            default: false
        }
    },
    components: {
        LoadingIcon
    }
}
</script>
