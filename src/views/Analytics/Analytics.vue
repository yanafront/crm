<template>
    <div class="column-start h-100">
        <div class="row-between mb-40">
            <template v-if="isAnalyticLogRoute">
                <div
                    class="lg-12 row-baseline pointer mb-8 f-15-grey"
                    @click="$router.push({ name: 'Analytics' })"
                >
                    <arrow-shewron
                        :transform="180"
                        width="14"
                        height="14"
                        class="i-green mr-2"
                    />
                    Analytics
                </div>
                <div class="column-start lg-6 sm-12">
                    <h1 class="f-28-black f-black">{{ curentMetric }}</h1>
                    <p class="f-18-grey f-medium mt-4">{{ descriptionForPage }}</p>
                </div>
            </template>
            <div
                v-else
                class="column-start lg-6 sm-12"
            >
                <h1 class="f-28-black f-black">Analytics</h1>
                <p class="f-18-grey f-medium mt-4">You can see number of views and clicks on your profile.</p>
            </div>
            <permission-checker
                :roles="[
                    USER_ROLES.INDIVIDUAL_PAID,
                    USER_ROLES.BUSINESS_PAID,
                    USER_ROLES.ADMIN
                ]"
            >
                <div :class="[ mScreen ? 'mt-8 row-center' : 'lg-2 s-align-8']">
                    <vue-select
                        v-if="usersList.length"
                        ref="select"
                        :options="usersList"
                        :label-by="option => fullName(option)"
                        close-on-select
                        v-model="selectedUser"
                        searchable
                        :visible-options="serchResult"
                        placeholder="Select user"
                        @selected="setSelectedUser($event)"
                        @search:input="serchQuery = $event.target.value"
                    >
                        <template #label="{ selected }">
                            <template v-if="selected">
                                <div>
                                    {{ `${selected.first_name} ${selected.last_name}` }}
                                </div>
                            </template>
                            <template v-else>Select user</template>
                        </template>
                        <template #dropdown-item="{ option }">
                            <div>
                                {{ `${option.first_name} ${option.last_name}` }}
                            </div>
                        </template>
                    </vue-select>
                </div>
            </permission-checker>
            <permission-checker
                :roles="[
                    USER_ROLES.INDIVIDUAL_PAID,
                    USER_ROLES.BUSINESS_PAID,
                    USER_ROLES.ADMIN
                ]"
            >
                <div :class="[ mScreen ? 'mt-8 row-center' : 's-align-9']">
                    <tabs-toggler
                        :tabs="tabs"
                        :selectedTab="analyticsPeriod"
                        @selectedPeriod="selectPeriod"
                    />
                </div>
            </permission-checker>
        </div>
        <div
            v-if="!loading"
            class="w-100 pb-40"
        >
            <!-- Show simple analytics for unpaid users -->
            <permission-checker
                :roles="[
                    USER_ROLES.INDIVIDUAL,
                    USER_ROLES.BUSINESS,
                ]"
            >
                <div
                    :class="[
                        'row-center pb-30',
                        {'bb-grey': userRole === USER_ROLES.INDIVIDUAL}
                    ]"
                    v-if="basicAnalytics"
                >
                    <base-analytics-card
                        :title="titles.last_day"
                        :data="basicAnalytics.last_day"
                    />
                    <base-analytics-card
                        :title="titles.last_week"
                        :data="basicAnalytics.last_week"
                    />
                    <base-analytics-card
                        :title="titles.total"
                        :data="basicAnalytics.total"
                    />
                </div>
                <div v-if="userRole === USER_ROLES.INDIVIDUAL
                    || userRole === USER_ROLES.BUSINESS">
                    <div
                        :class="[
                            'row-start row-baseline pt-30',
                            mScreen ? 'pb-20' : 'pb-30'
                        ]"
                    >
                        <div class="mr-50">
                            <p class="f-28-black f-black">Pro Analytics</p>
                            <p class="f-18-grey f-medium">Upgrade to Pro</p>
                        </div>
                        <router-link
                            v-if="!mScreen"
                            class="primary-button w-25"
                            :to="{ name: 'Products'}"
                        >
                            Upgrade to Pro
                        </router-link>
                    </div>
                    <div class="w-100">
                        <img
                            v-if="!mScreen"
                            src="@/assets/images/analytic_pro.png"
                            alt="Pro Analytics"
                            class="w-100"
                        >
                        <img
                            v-else
                            src="@/assets/images/analytic_pro_mobile.png"
                            alt="Pro Analytics"
                            class="w-100"
                        >
                        <router-link
                            v-if="mScreen"
                            class="primary-button w-100 mt-20 mb-50"
                            :to="{ name: 'Products'}"
                        >
                            Upgrade to Pro
                        </router-link>
                    </div>
                </div>
            </permission-checker>
            <!-- Show advanced analytics -->
            <permission-checker
                v-if="!isAnalyticLogRoute"
                :roles="[
                    USER_ROLES.INDIVIDUAL_PAID,
                    USER_ROLES.BUSINESS_PAID,
                    USER_ROLES.ADMIN
                ]"
            >
                <div class="row-start mt-20">
                    <div
                        v-for="(item, i) in advancedAnalyticsData"
                        :key="i"
                        :class="[
                            'mb-40 sm-12',
                            !mScreen && i + 1 !== 4 && i + 1 !== 5 ? 'pr-40' : '',
                            i + 1 <= 4 ? 'lg-3' : 'lg-12'
                        ]"
                    >
                        <advanced-analytics-card
                            :data="item"
                            :analyticsPeriod="analyticsPeriod"
                            @click="toMetric(item)"
                            class="pointer"
                        />
                    </div>
                </div>
            </permission-checker>
            <router-view
                v-else
                :businessSubuserCardId="selectedUserCardId"
                :selectedPeriod="selectedPeriod"
            />
        </div>
        <loader v-else/>
    </div>
</template>

<script>
import {
    BaseAnalyticsCard, PermissionChecker, AdvancedAnalyticsCard,
    TabsToggler
} from '@/components';
import { ArrowShewron } from '@/icons';
import {
    BASE_ANALYTICS_TITLES, USER_ROLES, ADVANCED_ANALYTICS_METRICS,
    DATE_FILTERS_OPTIONS
} from '@/constants';
import { fullName } from '@/helpers/commonHelpers.js';
import { mapGetters } from 'vuex';

export default {
    name: "Analytics",
    components: {
        PermissionChecker,
        BaseAnalyticsCard,
        AdvancedAnalyticsCard,
        TabsToggler,
        ArrowShewron
    },
    data() {
        return {
            USER_ROLES,
            loading: false,
            basicAnalytics: {
                last_day: {},
                last_week: {},
                total: {}
            },
            titles: {
                last_day: BASE_ANALYTICS_TITLES.LAST_DAY,
                last_week: BASE_ANALYTICS_TITLES.LAST_WEEK,
                total: BASE_ANALYTICS_TITLES.TOTAL,
            },
            advancedAnalyticsData: [
                {
                    type: ADVANCED_ANALYTICS_METRICS.TAPS.TITLE,
                    metric: ADVANCED_ANALYTICS_METRICS.TAPS.SLAG,
                    counter: 0
                },
                {
                    type: ADVANCED_ANALYTICS_METRICS.CONTACTS.TITLE,
                    metric: ADVANCED_ANALYTICS_METRICS.CONTACTS.SLAG,
                    counter: 0
                },
                {
                    type: ADVANCED_ANALYTICS_METRICS.DOWNLOAD.TITLE,
                    metric: ADVANCED_ANALYTICS_METRICS.DOWNLOAD.SLAG,
                    counter: 0
                },
                {
                    type: ADVANCED_ANALYTICS_METRICS.DEVICE.TITLE,
                    metric: ADVANCED_ANALYTICS_METRICS.DEVICE.SLAG,
                    counter: 0
                },
                {
                    type: ADVANCED_ANALYTICS_METRICS.LINKS.TITLE,
                    metric: ADVANCED_ANALYTICS_METRICS.LINKS.SLAG,
                    counter: 0
                }
            ],
            tabs: [
                DATE_FILTERS_OPTIONS.DAY,
                DATE_FILTERS_OPTIONS.WEEK,
                DATE_FILTERS_OPTIONS.MONTH,
                DATE_FILTERS_OPTIONS.CUSTOM,
            ],
            analyticsPeriod: 'all time',
            usersList: [],
            selectedUser: null,
            selectedUserCardId: null,
            selectedPeriod: null,
            serchQuery: ''
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userId: 'user/getUserId',
            userCardID: 'user/getCardId',
            allUserCards: 'cards/getAllCards'
        }),
        isAnalyticLogRoute() {
            return this.$route.name === 'AnalyticMetric';
        },
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
        descriptionForPage() {
            if (this.$route?.params?.metric) {
                switch (this.$route.params.metric) {
                    case ADVANCED_ANALYTICS_METRICS.TAPS.SLAG:
                        return 'Here you can see the log with time stamps which captures every moment your Public Profile is opened.';
                    case ADVANCED_ANALYTICS_METRICS.CONTACTS.SLAG:
                        return 'Here you can see contact details of the people who have shared their contact information with you.';
                    case ADVANCED_ANALYTICS_METRICS.DOWNLOAD.SLAG:
                        return 'Here you can see the log with time stamps which captures every moment your vCard is downloaded.';
                    case ADVANCED_ANALYTICS_METRICS.DEVICE.SLAG:
                        return 'Here you can see the log with time stamps which captures the unique device ID (using device fingerprinting).';
                    case ADVANCED_ANALYTICS_METRICS.LINKS.SLAG:
                        return 'Here you can see the log with time stamps which captures every link when it is opened. You can see Top 3 links on the main dashboard.';
                }
            }
        },
        serchResult() {
            if (this.serchQuery) {
                return this.usersList
                    .filter(user => {
                        const userFullName = this.fullName(user);
                        return userFullName.toLowerCase().includes(this.serchQuery.toLowerCase());
                    });
            } else {
                return this.usersList;
            }
        }
    },
    watch: {
        userCardID() {
            if (this.userRole === USER_ROLES.INDIVIDUAL_PAID) {
                this.getAdvancedAnalyticsByAuthUser();
            }
        },
        userId(newVal) {
            if (
                (this.userRole === USER_ROLES.BUSINESS_PAID || this.userRole === USER_ROLES.ADMIN)
                && newVal
            ) {
                this.getUsers()
                    .finally(() => {
                        this.getAdvancedAnalyticsByAuthUser();
                    });
            }
        },
        '$route' (to, from) {
            if (from.name === 'AnalyticMetric' && to.name === 'Analytics') {
                this.analyticsPeriod = 'all time';
                this.getAdvancedAnalyticsByAuthUser();
            }
        }
    },
    methods: {
        // Methods imported from helpers
        fullName,
        getBasicAnalyticsByAuthUser() {
            this.loading = true;
            this.$store.dispatch('analytics/GET_BASIC_ANALYTICS_BY_AUTH_USER')
                .then((data) => {
                    this.basicAnalytics = data.data;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        parseAdvancedAnalytics(data) {
            this.advancedAnalyticsData.forEach(item => {
                switch (item.type) {
                    case ADVANCED_ANALYTICS_METRICS.TAPS.TITLE:
                        item.counter = data.views;
                        break;
                    case ADVANCED_ANALYTICS_METRICS.CONTACTS.TITLE:
                        item.counter = data.contacts;
                        break;
                    case ADVANCED_ANALYTICS_METRICS.DOWNLOAD.TITLE:
                        item.counter = data.downloads;
                        break;
                    case ADVANCED_ANALYTICS_METRICS.DEVICE.TITLE:
                        item.counter = data.devices;
                        break;
                    case ADVANCED_ANALYTICS_METRICS.LINKS.TITLE:
                        item.counter = data.clicks;
                        item.social_clicks = data.type_clicks;
                        break;
                }
            });
        },
        getAdvancedAnalyticsByAuthUser(period) {
            this.loading = true;

            let params = {
                card_id: this.selectedUserCardId
            };

            if (period) {
                Object.assign(params, period);
            }

            this.$store.dispatch('analytics/GET_ADVANCED_ANALYTICS_BY_AUTH_USER', { params })
                .then((data) => {
                    this.parseAdvancedAnalytics(data.data);
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        selectPeriod(val) {
            let { period, params } = val;
            this.analyticsPeriod = period;
            this.selectedPeriod = params;

            if (!this.isAnalyticLogRoute) {
                this.getAdvancedAnalyticsByAuthUser(params);
            }
        },
        toMetric(val) {
            this.analyticsPeriod = '';
            this.$router.push({
                name: 'AnalyticMetric',
                params: {
                    metric: val.metric
                }
            });
        },
        getUsers() {
            let requestPayload = {};

            let storeModuleName = '';
            switch (this.userRole) {
                case USER_ROLES.BUSINESS_PAID:
                    storeModuleName = 'users/GET_ALL_BUSINESS_SUBUSERS';
                    requestPayload['userId'] = this.userId;
                    break;
                case USER_ROLES.ADMIN:
                    const params = {
                        perPage: 10000,
                        with_sub_users: 1
                    };

                    storeModuleName = 'users/GET_ALL_USERS_BY_SUPERADMIN';
                    requestPayload['params'] = params;
                    break;
            }

            return this.$store.dispatch(storeModuleName, requestPayload)
                .then((data) => {
                    switch (this.userRole) {
                        case USER_ROLES.BUSINESS_PAID:
                            this.usersList.push(...data);
                            break;
                        case USER_ROLES.ADMIN:
                            const adminUserIndex = data.data.findIndex(el => el.role === USER_ROLES.ADMIN);
                            if (adminUserIndex !== -1) {
                                data.data.splice(adminUserIndex, 1);
                            }
                            this.usersList.push(...data.data);
                            break;
                    }
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    if (this.usersList.length) {
                        this.selectedUser = this.usersList[0];
                        this.selectedUserCardId = this.usersList[0].card_id;
                    }
                });
        },
        setSelectedUser(val) {
            this.selectedUserCardId = val.card_id;
            if (!this.isAnalyticLogRoute) {
                this.getAdvancedAnalyticsByAuthUser();
            }
            this.analyticsPeriod = 'all time';
        },
        async setMyCards() {
            this.loading = true;
            let loggedUserCards = [];

            let setCards = (cardsArr) => {
                return cardsArr.map((el, index) => {
                    return {
                        id: el.is_primary ? -1 : null,
                        card_id: el.card_id,
                        first_name: 'My',
                        last_name: el.is_primary ? 'primary card' : `card ${el.first_name} ${el.last_name}`
                    }
                })
                .sort(function(a, b) {
                    return a.id - b.id;
                });
            };

            if (!this.allUserCards.length) {
                await this.$store.dispatch('cards/GET_CARDS_BY_AUTH_USER')
                    .then((data) => {
                        loggedUserCards = setCards(data.data);
                        this.usersList.unshift(...loggedUserCards);
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            } else {
                loggedUserCards = setCards(this.allUserCards);
                this.usersList.unshift(...loggedUserCards);
            }

            if (this.usersList.length) {
                this.selectedUser = this.usersList[0];
                this.selectedUserCardId = this.usersList[0].card_id;
            }
        }
    },
    async created() {
        await this.setMyCards();

        if (this.userRole === USER_ROLES.INDIVIDUAL
            || this.userRole === USER_ROLES.BUSINESS
        ) {
            this.getBasicAnalyticsByAuthUser();
        }

        if (this.userRole === USER_ROLES.BUSINESS_PAID && this.userId) {
            // Get business users, set first user as default user
            // and after this send request for getting analytics data
            this.getUsers()
                .finally(() => {
                    this.getAdvancedAnalyticsByAuthUser();
                });
        }

        if (this.userCardID && this.userRole === USER_ROLES.INDIVIDUAL_PAID) {
            this.getAdvancedAnalyticsByAuthUser();
        } else {
            this.loading = true;
        }

        if (this.userCardID && this.userRole === USER_ROLES.ADMIN) {
            this.getUsers()
                .finally(() => {
                    this.getAdvancedAnalyticsByAuthUser();
                });
        } else {
            this.loading = true;
        }
    }
}
</script>
