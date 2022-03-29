<template>
    <div class="tabs-toggler-container">
        <div class="row-baseline tabs-toggler flex-no-wrap">
            <span
                :class="[
                    'tabs-toggler_item pointer',
                    { 'active': item === activeTab },
                    item === DATE_FILTERS_OPTIONS.CUSTOM
                        ? 'tabs-toggler_item-custom-date'
                        : 'pv-3'
                ]"
                v-for="(item, i) in tabs"
                :key="i"
                @click="handleClick(item)"
            >
                <template v-if="item !== DATE_FILTERS_OPTIONS.CUSTOM">
                    {{ capitalizeFirstLetter(item) }}
                </template>
                <template v-else>
                    <date-picker
                        v-model="range"
                        class="w-100"
                        mode="date"
                        color="gray"
                        update-on-input
                        is-range
                        timezone='UTC'
                        locale="en"
                        :masks="masks"
                        :is-dark="isDarkMode"
                        @mouseenter="handleClick(DATE_FILTERS_OPTIONS.CUSTOM)"
                        @mouseleave="handleClick('')"
                    >
                        <template v-slot="{ inputValue, inputEvents }">
                            <div class="tabs-toggler-datepicker">
                                <input
                                    :class="['form-input-field']"
                                    :value="`${inputValue.start} - ${inputValue.end}`"
                                    v-on="inputEvents.start"
                                />
                            </div>
                        </template>
                    </date-picker>
                </template>
            </span>
        </div>
    </div>
</template>

<script>
import { DatePicker } from 'v-calendar';
import { DATE_FILTERS_OPTIONS } from '@/constants';
import moment from 'moment';
import { capitalizeFirstLetter } from '@/helpers/commonHelpers.js';
import { mapGetters } from 'vuex';

export default {
    name: 'TabsToggler',
    components: {
        DatePicker,
    },
    props: {
        tabs: {
           type: Array,
           required: true
        },
        selectedTab: {
            type: String,
            required: false
        }
    },
    emits: ['selectedPeriod'],
    data() {
        return {
            DATE_FILTERS_OPTIONS,
            clickedTab: null,
            range: {
                start: new Date(),
                end: new Date(),
            },
            masks: {
                input: "MMM DD, YYYY"
            }
        }
    },
    computed: {
        ...mapGetters({
            isDarkMode: 'cards/darkModeIsActive'
        }),
        activeTab() {
            return this.clickedTab;
        }
    },
    watch: {
        clickedTab(newVal) {
            switch (newVal) {
                case DATE_FILTERS_OPTIONS.DAY:
                    this.$emit('selectedPeriod', {
                        period: DATE_FILTERS_OPTIONS.DAY,
                        params: {
                            start_date: moment().local().format('DD.MM.YYYY')
                        }
                    });
                    break;
                case DATE_FILTERS_OPTIONS.WEEK:
                    let week = new Date();
                    week.setDate(week.getDate() - 7);
                    this.$emit('selectedPeriod', {
                        period: DATE_FILTERS_OPTIONS.WEEK,
                        params: {
                            start_date: moment(week).local().format('DD.MM.YYYY'),
                            end_date: moment().local().format('DD.MM.YYYY')
                        }
                    });
                    break;
                case DATE_FILTERS_OPTIONS.MONTH:
                    let month = new Date();
                    month.setMonth(month.getMonth() - 1);
                    this.$emit('selectedPeriod', {
                        period: DATE_FILTERS_OPTIONS.MONTH,
                        params: {
                            start_date: moment(month).local().format('DD.MM.YYYY'),
                            end_date: moment().local().format('DD.MM.YYYY')
                        }
                    });
                    break;
            }
        },
        selectedTab(newVal) {
            if (newVal === '') {
                this.clickedTab = newVal;
            }
        },
        range(newVal) {
            if (this.clickedTab === DATE_FILTERS_OPTIONS.DAY
                || this.clickedTab === DATE_FILTERS_OPTIONS.WEEK
                || this.clickedTab === DATE_FILTERS_OPTIONS.MONTH
                || this.clickedTab === ''
            ) {
                return;
            }

            this.$emit('selectedPeriod', {
                period: DATE_FILTERS_OPTIONS.CUSTOM,
                params: {
                    start_date: moment(this.range.start).local().format('DD.MM.YYYY'),
                    end_date: moment(this.range.end).local().format('DD.MM.YYYY')
                }
            });
        }
    },
    methods: {
        capitalizeFirstLetter,
        resetDateRange() {
            this.range = {
                start: new Date(),
                end: new Date(),
            };
        },
        handleClick(item) {
            this.clickedTab = item;
            if (item === DATE_FILTERS_OPTIONS.CUSTOM || item === '') {
                return;
            }
            this.resetDateRange();
        }
    },
    created() {
        this.clickedTab = this.selectedTab;
    }
}
</script>
