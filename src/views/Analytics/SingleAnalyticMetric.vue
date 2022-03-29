<template>
    <div class="column-start h-100">
        <div
            v-if="!loading"
            class="row-start h-100"
        >
            <div
                v-if="metricInfo.length"
                class="w-100"
            >
                <dynamic-table
                    :header="tableData.tableHeader"
                    :tableData="metricInfo"
                    :optionsForRender="tableData.optionsForRender"
                />
                <div class="row-center pv-8">
                    <load-more
                        v-if="isMorePages"
                        :status="loadingStatus"
                        @click="getData(null, false)"
                    />
                </div>
            </div>
            <div
                v-else
                class="w-100 s-align-5"
            >
                <p class="f-18-grey">Your page is empty</p>
            </div>
        </div>
        <loader v-else />
    </div>
</template>

<script>
import { DynamicTable } from '@/components';
import {
    USER_ROLES, ADVANCED_ANALYTICS_METRICS, ACTION_ENTITY_TYPES, ACTION_TYPES
} from '@/constants';
import { mapGetters } from 'vuex';

export default {
    name: "SingleAnalyticMetric",
    components: {
        DynamicTable
    },
    data() {
        return {
            USER_ROLES,
            loading: false,
            loadingStatus: false,
            analyticsForSelectedPeriod: null,
            metricInfo: [],
            isMorePages: false,
            pageNumber: 1
        }
    },
    props: {
        metric: {
            type: String,
            required: true
        },
        businessSubuserCardId: {
            type: [String, Number],
            required: false
        },
        selectedPeriod: {
            type: Object,
            required: false
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userCardID: 'user/getCardId'
        }),
        curentMetric() {
            if (this.$route?.params?.metric) {
                switch (this.$route.params.metric) {
                    case ADVANCED_ANALYTICS_METRICS.TAPS.SLAG:
                        return  ADVANCED_ANALYTICS_METRICS.TAPS.TITLE;
                    case ADVANCED_ANALYTICS_METRICS.CONTACTS.SLAG:
                        return  ADVANCED_ANALYTICS_METRICS.CONTACTS.TITLE;
                    case ADVANCED_ANALYTICS_METRICS.DOWNLOAD.SLAG:
                        return  ADVANCED_ANALYTICS_METRICS.DOWNLOAD.TITLE;
                    case ADVANCED_ANALYTICS_METRICS.DEVICE.SLAG:
                        return  ADVANCED_ANALYTICS_METRICS.DEVICE.TITLE;
                    case ADVANCED_ANALYTICS_METRICS.LINKS.SLAG:
                        return  ADVANCED_ANALYTICS_METRICS.LINKS.TITLE;
                }
            }
        },
        tableData() {
            if (this.metric && this.metricInfo.length) {
                switch (this.$route.params.metric) {
                    case ADVANCED_ANALYTICS_METRICS.TAPS.SLAG:
                        return  {
                            tableHeader: ['Action', 'Date & Time'],
                            optionsForRender: ['action_type', 'created_at']
                        };
                    case ADVANCED_ANALYTICS_METRICS.CONTACTS.SLAG:
                        return  {
                            tableHeader: ['Name', 'Number', 'Email', 'Company', 'Date & Time'],
                            optionsForRender: ['name', 'phone', 'email', 'company_name', 'created_at']
                        };
                    case ADVANCED_ANALYTICS_METRICS.DOWNLOAD.SLAG:
                        return  {
                            tableHeader: ['Action', 'Date & Time'],
                            optionsForRender: ['action_type', 'created_at']
                        };
                    case ADVANCED_ANALYTICS_METRICS.DEVICE.SLAG:
                        return  {
                            tableHeader: ['Device ID', 'Date & Time'],
                            optionsForRender: ['device_id', 'created_at']
                        };
                    case ADVANCED_ANALYTICS_METRICS.LINKS.SLAG:
                        return  {
                            tableHeader: ['Click', 'Date & Time'],
                            optionsForRender: ['entity', 'created_at']
                        };
                }
            } else {
                return [];
            }
        }
    },
    watch: {
        userCardID() {
            if (this.userRole === USER_ROLES.INDIVIDUAL_PAID) {
                this.getData(null);
            }
        },
        businessSubuserCardId() {
            this.resetPagination();
            this.getData(null);
        },
        selectedPeriod(val) {
            this.resetPagination();
            this.analyticsForSelectedPeriod = val;
            this.getData(val);
        }
    },
    methods: {
        getData(period = null, showloader = true) {
            if (showloader) {
                this.loading = true;
            }

            let params = {
                order: 'desc',
                entity_id: this.userCardID,
                entity_type: ACTION_ENTITY_TYPES.CARD
            };

            if (this.userRole === USER_ROLES.BUSINESS_PAID
                || this.userRole === USER_ROLES.ADMIN
            ) {
                params.entity_id = this.businessSubuserCardId;
            }

            if (this.pageNumber >= 1) {
                Object.assign(params, { page: this.pageNumber });
            }

            if (period) {
                Object.assign(params, {
                    ...period
                });
            }

            // For pagination in selected date period
            if (this.analyticsForSelectedPeriod && Object.keys(this.analyticsForSelectedPeriod)) {
                Object.assign(params, {
                    ...this.analyticsForSelectedPeriod
                });
            }

            this.pageNumber++;
            this.loadingStatus = true;

            switch (this.curentMetric) {
                case ADVANCED_ANALYTICS_METRICS.LINKS.TITLE:
                    params['action_type'] = ACTION_TYPES.CLICK;
                    break;
                case ADVANCED_ANALYTICS_METRICS.TAPS.TITLE:
                    params['action_type'] = ACTION_TYPES.VIEW;
                    break;
                case ADVANCED_ANALYTICS_METRICS.CONTACTS.TITLE:
                    params['action_type'] = ACTION_TYPES.CONTACT;
                    break;
                case ADVANCED_ANALYTICS_METRICS.DEVICE.TITLE:
                    params['action_type'] = ACTION_TYPES.DEVICE;
                    break;
                case ADVANCED_ANALYTICS_METRICS.DOWNLOAD.TITLE:
                    params['action_type'] = ACTION_TYPES.DOWNLOAD;
                    break;
            }

            this.$store.dispatch('analytics/GET_ADVANCED_ANALYTICS_LOG', { params })
                .then((data) => {
                    this.metricInfo.push(...data.data.data);
                    data.data.current_page === data.data.last_page
                        ? this.isMorePages = false
                        : this.isMorePages = true;
                    this.loadingStatus = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        resetPagination() {
            this.analyticsForSelectedPeriod = null;
            this.metricInfo.splice(0, this.metricInfo.length);
            this.pageNumber = 1;
        }
    },
    created() {
        if (this.userCardID && this.userRole === USER_ROLES.INDIVIDUAL_PAID) {
            this.getData(null);
        } else {
            this.loading = true;
        }

        if (this.userRole === USER_ROLES.BUSINESS_PAID
            || this.userRole === USER_ROLES.ADMIN) {
            this.getData(null);
        }
    }
}
</script>
