<template>
    <div
        :class="[
            'dashboard-analytics-card br-20 ph-30 w-100',
            isLinksCard ? 'pt-6 pb-4' : 'pv-20'
        ]"
    >
        <div
            :class="[
                'row-between',
                isLinksCard ? '' : 'pv-5'
            ]"
        >
            <div class="column-start">
                <p class="f-16-black f-black">{{ data.type }}</p>
                <p class="f-12-grey f-medium mt-1">by {{ analyticsPeriod }}</p>
                <p class="f-28-black f-black mt-3">{{ data.counter }}</p>
                <div
                    v-if="isLinksCard"
                    class="column-start mt-4"
                >
                    <div
                        class="social-link-counter mb-2 f-12-black f-sbold"
                        v-for="(value, key, idx) in topSocialLinks"
                        :key="key"
                        v-show="idx + 1 <= 3 && value > 0"
                    >
                        <span class="mr-2 f-10-white">{{ idx + 1 }}</span>
                        <template v-if="key === LINKS_TYPES.COMMON || key === LINKS_TYPES.BUSINESS">
                            {{ getLinksDomain(key) }}
                        </template>
                        <template v-else>
                            <component
                                :is="`${key}-icon`"
                                class="i-green"
                                size="10"
                            />
                        </template>
                    </div>
                </div>
            </div>
            <div
                v-if="isLinksCard"
                :class="[
                    mScreen ? 'mt-3 row-center sm-12' : 's-align-6'
                ]"
            >
                <div
                    v-for="(value, key, index) in topSocialLinks"
                    :key="key"
                    :class="[
                        'column-center',
                        {'ml-5' : index !== 0}
                    ]"
                    v-show="value > 0 && key !== LINKS_TYPES.COMMON && key !== LINKS_TYPES.BUSINESS"
                >
                    <span class="f-14-black f-medium">{{ capitalizeFirstLetter(key) }}</span>
                    <span class="f-14-grey f-medium mb-2">Clicks: {{ value }}</span>
                    <ve-progress
                        :progress="getClicksInPercent(key)"
                        :size="60"
                        :thickness="6"
                        :empty-thickness="6"
                        line-mode="center"
                        :color="isDarkMode ? '#fff' :'#000'"
                        :emptyColor="isDarkMode ? '#09161E' :'#c9c9c9'"
                    >
                        <span slot:legend-caption class="f-15-black f-black">{{ getClicksInPercent(key) }}% </span>
                    </ve-progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    ArrowIcon, FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon,
    TiktokIcon, PaypalIcon, VenmoIcon, ZelleIcon
} from '@/icons';
import { ADVANCED_ANALYTICS_METRICS, LINKS_DOMAINS, LINKS_TYPES } from '@/constants';
import { capitalizeFirstLetter } from '@/helpers/commonHelpers';
import { mapGetters } from 'vuex';

export default {
    name: 'AdvancedAnalyticsCard',
    components: {
        ArrowIcon,
        FacebookIcon,
        InstagramIcon,
        LinkedinIcon,
        TwitterIcon,
        TiktokIcon,
        PaypalIcon,
        VenmoIcon,
        ZelleIcon
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        analyticsPeriod: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            LINKS_TYPES,
            ADVANCED_ANALYTICS_METRICS
        }
    },
    computed: {
        ...mapGetters({
            isDarkMode: 'cards/darkModeIsActive'
        }),
        isLinksCard() {
            return this.data.type === ADVANCED_ANALYTICS_METRICS.LINKS.TITLE;
        },
        topSocialLinks() {
            if (this.data?.social_clicks) {
                let socClicks = this.data.social_clicks;
                let keysSorted = Object.keys(socClicks).sort(function(a, b){
                    return socClicks[b] - socClicks[a];
                });

                let newObj = {};
                for(let x of keysSorted) {
                    newObj[x] = socClicks[x];
                }
                return newObj;
            } else {
                return {};
            }
        },
        socialLinksClicksSum() {
            if (this.data?.social_clicks) {
                return Object.values(this.data.social_clicks)
                    .reduce(function(previousValue, currentValue) {
                        return previousValue + currentValue;
                    });
            }
        }
    },
    methods: {
        capitalizeFirstLetter,
        getClicksInPercent(socialLink) {
            if (this.topSocialLinks?.[socialLink]) {
                return Number((this.topSocialLinks?.[socialLink] / this.socialLinksClicksSum * 100).toFixed(0));
            } else {
                return 0;
            }
        },
        getLinksDomain(val) {
            if (val === LINKS_TYPES.COMMON) {
                return 'Named link';
            }

            if (val === LINKS_TYPES.BUSINESS) {
                return 'Business Website Hyperlink';
            }
        }
    }
}
</script>
