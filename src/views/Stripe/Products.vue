<template>
    <div
        v-if="!loading"
        class="column-start h-100 stripe-products"
    >
        <div class="column-start mb-40">
            <h1 class="f-28-black f-black">Products and Plans</h1>
            <p class="f-18-grey f-medium mt-4">Here you can read about our PRO features and subscription options.</p>
        </div>
        <div class="row-start">
            <div
                :class="[
                    'product-card row-between br-20 lg-4 sm-12 mb-20',
                    mScreen ? '' : 'mr-20'
                ]"
            >
                <div class="column-start w-100">
                    <p class="f-20-black f-black row-start row-baseline bb-grey p-20">
                        Pro Business
                    </p>
                    <div class="f-14-black f-medium transition-01 mt-5 ph-20 bb-grey pb-20">
                        Retrēv will show how many TRUE connections a salesperson makes.
                        With easy to interpret data, our Advanced Analytics will reveal the statistics on
                        <ol class="pl-20 f-14-black f-bold pv-2">
                            <li># Taps</li>
                            <li># New contacts</li>
                            <li># vCards downloaded</li>
                            <li>Visited links, by rank</li>
                            <li># Unique devices</li>
                        </ol>
                        &#10148; Your salespersons will have access to Add Content (upload pdf files, photos, videos).<br />
                        &#10148; Salespersons can delete unnecessary contacts<br />
                        &#10148; As Business Admin you would be able to see all users, their statistics, filter data.<br />
                        &#10148; Download Contacts (XLSX)<br/>
                        &#10148; Dark mode<br/>
                        &#10148; Company Branding(button color, background color, cover photo)<br/>
                        &#10148; Create Multiple Profiles<br/>
                        &#10148; Reorder content<br/>
                        &#10148; Up to 5 Named links<br/>
                    </div>
                    <div class="column-start ph-20 mt-5 pb-20">
                        <p
                            v-if="userRole === USER_ROLES.BUSINESS_PAID"
                            class="lg-12 sm-12 f-16-black f-black"
                        >
                            If you wish to change your subscription - please contact us!
                        </p>
                        <div
                            v-else
                            class="column-start lg-12 sm-12"
                        >
                            <p class="f-16-black f-black">Price depends on quantity ordered.</p>
                            <p class="f-16-black f-medium mt-1">Don’t hesitate to contact us!</p>
                        </div>
                        <primary-button
                            v-if="userRole === USER_ROLES.BUSINESS_PAID"
                            :class="[
                                'pointer mt-50',
                                {'w-100' : mScreen}
                            ]"
                            @click="showUnsubscrybeModal"
                        >
                            Contact us
                        </primary-button>
                        <a
                            v-else
                            :href="BUSINESS_SITE_DOMAIN_FORM"
                            target="_blank"
                            :class="[
                                'primary-button pointer mt-50',
                                {'w-100' : mScreen}
                            ]"
                        >
                            Contact us
                        </a>
                    </div>
                </div>
            </div>
            <permission-checker
                :roles="[
                    USER_ROLES.INDIVIDUAL,
                    USER_ROLES.INDIVIDUAL_PAID,
                    USER_ROLES.ADMIN
                ]"
            >
                <div
                    v-for="product in availableProductToDisplaying"
                    :key="product.id"
                    :class="[
                        'product-card row-between br-20 lg-4 sm-12 mb-20',
                        mScreen ? '' : 'mr-20',
                        {'b-darkblue' : showBorderOnCard && product.id === productInProcessing}
                    ]"
                >
                    <div class="column-start w-100">
                        <p class="f-20-black f-black row-start row-baseline bb-grey p-20">
                            {{ product.name }}
                        </p>
                        <p class="f-14-black f-medium transition-01 mt-5 ph-20 bb-grey pb-20">
                            Retrēv will reveal the Advanced Analytics statistics on your card:
                            <ol class="pl-20 f-14-black f-bold pv-2">
                                <li># Taps</li>
                                <li># New contacts</li>
                                <li># vCards downloaded</li>
                                <li>Visited links, by rank</li>
                                <li># Unique devices</li>
                            </ol>
                            &#10148; You will have access to Add Content feature (upload pdf files, photos, videos).<br/>
                            &#10148; Ability to delete unnecessary contacts.<br/>
                            &#10148; Download Contacts (XLSX)<br/>
                            &#10148; Dark mode<br/>
                            &#10148; Company Branding(button color, background color, cover photo)<br/>
                            &#10148; Create Multiple Profiles<br/>
                            &#10148; Reorder content<br/>
                            &#10148; Up to 5 Named links<br/>
                        </p>
                        <p class="f-16-black f-black mb-3 mt-5 row-baseline ph-20">
                            Available plans
                        </p>
                        <div
                            v-for="(plan, index) in product.plans"
                            :key="plan.id"
                            :class="[
                                'row-between row-baseline ph-20',
                                { 'mt-3' : index !== 0 },
                                { 'bb-grey pb-3' : index !== product.plans.length - 1 },
                                {'pb-20' : index === product.plans.length - 1}
                            ]"
                        >
                            <div
                                :class="[
                                    'lg-6 sm-12 row-baseline',
                                    mScreen ? 'row-between' : 'row-start'
                                ]"
                            >
                                <span class="f-16-black f-black">
                                    Price:
                                    <span class="f-14-black f-medium">${{ plan.cost }}/{{ plan.interval }}</span>
                                </span>
                                <span
                                    class="small-border-button ml-5"
                                    v-if="activePlanLabel(plan)"
                                >
                                    Active plan
                                </span>
                            </div>
                            <div :class="[mScreen ? 'mt-5 w-100' : 's-align-6']">
                                <primary-button
                                    v-if="!isActiveProduct(product, plan)"
                                    @click="subscrybeToPlan(product, plan)"
                                    :class="{'w-100' : mScreen}"
                                >
                                    <template v-if="showButtonsLoader(product, plan)">
                                        <loader
                                            size="mini"
                                            loaderColor="white"
                                            class="s-align-5"
                                        />
                                    </template>
                                    <template v-else>
                                        Subscribe
                                    </template>
                                </primary-button>
                                <primary-button
                                    v-if="showUnsubscribe(product, plan)"
                                    @click="unsubscrybeToPlan(product, plan)"
                                    :class="{'w-100' : mScreen}"
                                >
                                    <template v-if="showButtonsLoader(product, plan)">
                                        <loader
                                            size="mini"
                                            loaderColor="white"
                                            class="s-align-5"
                                        />
                                    </template>
                                    <template v-else>
                                        Unsubscribe
                                    </template>
                                </primary-button>
                                <primary-button
                                    v-if="showRenew(product, plan)"
                                    @click="renewSubscrybeToPlan(product, plan)"
                                    :class="{'w-100' : mScreen}"
                                >
                                    <template v-if="showButtonsLoader(product, plan)">
                                        <loader
                                            size="mini"
                                            loaderColor="white"
                                            class="s-align-5"
                                        />
                                    </template>
                                    <template v-else>
                                        Renew subscription
                                    </template>
                                </primary-button>
                            </div>
                        </div>
                    </div>
                </div>
            </permission-checker>
        </div>
        <div
            class="row-center mt-40"
            id="card-box"
        >
            <div
                class="lg-5 sm-12 mb-40"
                :style="`min-height: ${mScreen ? '400px' : '290px'}`"
            >
                <router-view
                    @subscribeToPlan="handle"
                />
            </div>
        </div>
        <modal
            v-if="showConfirmModal"
            @close="showConfirmModal = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold w-90 t-center pl-50">
                    Fill out our contact form.
                </h1>
            </template>
            <template #body>
                <div class="row-center">
                    <p class="t-center f-16-black f-sbold">
                        If you wish to unsubscribe from your plan - please fill out our contact form.
                        Follow the link:
                        <a
                            :href="BUSINESS_SITE_DOMAIN_FORM"
                            target="_blank"
                            class="pointer f-bold f-16-green"
                        >
                            Contact form
                        </a>
                    </p>
                </div>
            </template>
        </modal>
        <!-- Show this modal if subscrybe in progress and user
            want coming out from page -->
        <modal
            v-if="showWarningModal"
            @close="showWarningModal = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold w-90 t-center pl-50">
                    Subscription payment processing.
                </h1>
            </template>
            <template #body>
                <div class="row-center">
                    <p class="t-center f-16-black f-sbold">
                        Processing payment.<br />
                        Do not leave this page.
                    </p>
                </div>
            </template>
        </modal>
    </div>
    <loader v-else/>
</template>

<script>
import { PermissionChecker } from '@/components';
import Modal from '@/ui/modal/Modal.vue';
import { mapGetters } from 'vuex';
import { STRIPE_PRODUCT_TYPE, USER_ROLES, BUSINESS_SITE_DOMAIN_FORM } from '@/constants';
import { scrollToElementInBlock } from '@/helpers/commonHelpers';

export default {
    name: 'Products',
    components: {
        PermissionChecker,
        Modal
    },
    data() {
        return {
            USER_ROLES,
            BUSINESS_SITE_DOMAIN_FORM,
            loading: false,
            loadingButtons: false,
            productInProcessing: null,
            planInProcessing: null,
            showBorderOnCard: false,
            showConfirmModal: false,
            showWarningModal: false
        }
    },
    computed: {
        ...mapGetters({
            productsAndPlans: 'stripe/getAllProductsAndPlans',
            activeSubscription: 'user/getActiveSubscription',
            userRole: 'user/getUserRole',
        }),
        availableProductToDisplaying() {
            if (this.productsAndPlans && this.productsAndPlans.length) {
                return this.productsAndPlans
                    .filter(product => product.product_type !== STRIPE_PRODUCT_TYPE.BUSINESS);
            }
        }
    },
    methods: {
        isActiveProduct(product, plan) {
            let subscription = this.activeSubscription
                ? this.activeSubscription.find(item => item?.product_id === product.id && item?.plan_id === plan.id)
                : null;
            if (subscription) {
                return true;
            }
        },
        activeProductLabel(product) {
            let subscription = this.activeSubscription
                ? this.activeSubscription.find(item => item?.product_id === product.id)
                : null;
            if (subscription && !subscription.on_grace_period) {
                return true;
            }
        },
        activePlanLabel(plan) {
            let subscription = this.activeSubscription
                ? this.activeSubscription.find(item => item?.plan_id === plan.id)
                : null;

            return subscription;
        },
        showRenew(product, plan) {
            let subscription = this.activeSubscription
                ? this.activeSubscription.find(item => item?.product_id === product.id && item?.plan_id === plan.id)
                : null;
            return subscription ? subscription.on_grace_period : false;
        },
        showUnsubscribe(product, plan) {
            let subscription = this.activeSubscription
                ? this.activeSubscription.find(item => item?.product_id === product.id && item?.plan_id === plan.id)
                : null;
            return subscription
                ? subscription.stripe_status === 'active' && !subscription.on_grace_period
                : false;
        },
        showButtonsLoader({ id }, {id: planId}) {
            return this.loadingButtons
                && this.productInProcessing === id
                && this.planInProcessing === planId;
        },
        handle() {
            localStorage.setItem('startSubscription', true);
            const planId = JSON.parse(localStorage.getItem('choosenPlanId'));
            const productId = JSON.parse(localStorage.getItem('choosenProductId'));
            this.loadingButtons = true;
            this.productInProcessing = productId;
            this.planInProcessing = planId;

            this.$store.dispatch('stripe/SUBSCRIBE_TO_PLAN', planId)
                .then((data) => {
                    this.getUpdatedUserInfo();
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        'Your subscription has been activated successfully!'
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.loadingButtons = false;
                    this.productInProcessing = null;
                    this.planInProcessing = null;
                    localStorage.removeItem('choosenPlanId');
                    localStorage.removeItem('choosenProductId');
                    localStorage.removeItem('startSubscription');
                });
        },
        subscrybeToPlan(product, plan) {
            this.showBorderOnCard = true;
            this.productInProcessing = product.id;
            this.planInProcessing = plan.id;
            const planId = plan ? plan.id : null;
            const stripePaymentIsAdded = JSON.parse(localStorage.getItem('stripe_pm'));

            if (stripePaymentIsAdded) {
                localStorage.setItem('startSubscription', true);
                this.loadingButtons = true;
                this.$store.dispatch('stripe/SUBSCRIBE_TO_PLAN', planId)
                    .then((data) => {
                        this.getUpdatedUserInfo();
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            'Your subscription has been activated successfully!'
                        );
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    })
                    .finally(() => {
                        this.loadingButtons = false;
                        this.productInProcessing = null;
                        this.planInProcessing = null;
                        localStorage.removeItem('choosenPlanId');
                        localStorage.removeItem('choosenProductId');
                        localStorage.removeItem('startSubscription');
                    });
            } else {
                localStorage.setItem('choosenPlanId', planId);
                localStorage.setItem('choosenProductId', product.id);
                this.$router.push({ name: 'Payment' });
                scrollToElementInBlock(document.querySelector('#card-box'));
            }
        },
        unsubscrybeToPlan(product, plan) {
            if (this.userRole === USER_ROLES.INDIVIDUAL_PAID) {
                this.showUnsubscrybeModal();
            }
            // TODO: Now used manual unsubscrybe.
            // Uncomented this code for automatic unsubscrybe.
            //
            // this.productInProcessing = product.id;
            // this.planInProcessing = plan.id;
            // this.loadingButtons = true;
            // const { id: subscriptionId } = this.activeSubscription
            //     .find(item => {
            //         return item.product_id === product.id;
            //     });

            // this.$store.dispatch('stripe/UNSUBSCRIBE_TO_PLAN', subscriptionId)
            //     .then((data) => {
            //         this.getUpdatedUserInfo();
            //         this.$store.dispatch(
            //             'notifications/SHOW_SUCCESS_NOTIFICATION',
            //             `Your subscription has been canceled!`
            //         );
            //     })
            //     .catch(error => {
            //         this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
            //     })
            //     .finally(() => {
            //         this.loadingButtons = false;
            //         this.productInProcessing = null;
            //         this.planInProcessing = null;
            //     });
        },
        renewSubscrybeToPlan(product, plan) {
            this.productInProcessing = product.id;
            this.planInProcessing = plan.id;
            this.loadingButtons = true;

            const { id: subscriptionId } = this.activeSubscription
                .find(item => {
                    return item.product_id === product.id;
                });

            this.$store.dispatch('stripe/RENEW_PLAN_SUBSCIPTION', subscriptionId)
                .then((data) => {
                    this.getUpdatedUserInfo();
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your subscription has been renewed!`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.loadingButtons = false;
                    this.productInProcessing = null;
                    this.planInProcessing = null;
                });
        },
        getProducts() {
            return this.$store.dispatch('stripe/GET_PRODUCTS_AND_PLANS')
                .then((data) => {})
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        getUpdatedUserInfo() {
            this.$store.dispatch('user/GET_AUTH_USER_INFO')
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        getData() {
            this.loading = true;
            let promiseArr = [];

            if (!this.productsAndPlans) {
                promiseArr.push(this.getProducts());
            }

            Promise.all(promiseArr)
                .catch((error) => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showUnsubscrybeModal() {
            this.showConfirmModal = true;
        },
        subscrybeInProgress() {
            let subscriptions = JSON.parse(localStorage.getItem('startSubscription'));
            return subscriptions ? subscriptions : false;
        }
    },
    created() {
        this.getData();
    },
    beforeUnmount() {
        localStorage.removeItem('choosenProductId');
        localStorage.removeItem('choosenPlanId');
    },
    beforeRouteLeave (to, from, next) {
        if (this.subscrybeInProgress() === true) {
            this.showWarningModal = true;
            return;
        }
        localStorage.removeItem('startSubscription');
        next();
    }
}
</script>
