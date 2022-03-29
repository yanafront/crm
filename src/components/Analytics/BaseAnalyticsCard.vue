<template>
    <div
        :class="[
            'lg-4 sm-12',
            mScreen ? 'mb-8' : 'ph-20'
        ]"
        v-if="data"
    >
        <div class="analytics-card w-100 bg-grey br-20 ph-30 pv-25">
            <p class="mb-20 f-12-black f-bold">
                <span class="f-12-grey f-normal" v-if="title !== titleTotal">Past</span>
                {{ title }}
            </p>
            <div class="row-start flex-no-wrap bb-grey">
                <span class="round-iconX32 light-green-round-icon mr-8">
                    <eye-icon />
                </span>
                <div class="column-start">
                    <p class="f-28-black f-black">
                        {{ data.views }}
                    </p>
                    <span class="f-14-grey f-normal mb-20">Views</span>
                </div>
            </div>
            <div class="row-start flex-no-wrap mt-20">
                <span class="round-iconX32 light-yellow-round-icon mr-8">
                    <arrow-pointer-icon />
                </span>
                <div class="column-start">
                    <p class="f-28-black f-black">
                        {{ data.clicks }}
                    </p>
                    <span class="f-14-grey f-normal">Clicks</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EyeIcon, ArrowPointerIcon } from '@/icons';
import { BASE_ANALYTICS_TITLES } from '@/constants';

export default {
    name: "BaseAnalyticsCard",
    components: {
        EyeIcon,
        ArrowPointerIcon
    },
    data() {
        return {
            titleTotal: BASE_ANALYTICS_TITLES.TOTAL
        }
    },
    props: {
        title: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: true
        }
    },
}
</script>
