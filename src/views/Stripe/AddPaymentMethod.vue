<template>
    <div
        class="column-start lg-12 b-darkblue br-7 p-5"
        v-show="!loading && paymentsElement && !paymentMethodAdded"
    >
        <p class="f-16-black f-black mb-3">Add your card</p>
        <div id="payment-element" class="w-100"></div>
        <primary-button
            @click="confirmSetup"
            class="mt-20 w-100"
        >
            Add payment method
        </primary-button>
    </div>
    <loader v-if="loading"/>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import api from '@/api';

export default {
    name: 'AddPaymentMethod',
    components: {},
    emits: ['subscribeToPlan'],
    data () {
        return {
            loading: false,
            stripe: null,
            clientSecret: null,
            elements: null,
            paymentsElement: null,
            appearance: {
                theme: 'stripe',
                variables: {
                    fontFamily: ' "Inter", sans-serif',
                    fontLineHeight: '1.5',
                    borderRadius: '7px',
                    colorBackground: '#fff',
                    colorPrimaryText: '#000'
                },
                rules: {
                    '.Block': {
                        backgroundColor: 'var(--colorBackground)',
                        boxShadow: 'none',
                        padding: '12px'
                    },
                    '.Input': {
                        padding: '12px',
                        border: '1px solid #c6c9cd'
                    },
                    '.Input:disabled, .Input--invalid:disabled': {
                        color: 'lightgray'
                    },
                    '.Tab': {
                        padding: '10px 12px 8px 12px',
                        border: 'none'
                    },
                    '.Tab:hover': {
                        border: 'none',
                        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                    },
                    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                        border: 'none',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                    },
                    '.Label': {
                        fontWeight: '900',
                        color: '#000'
                    }
                }
            },
            locale: 'en',
            redirectUrl: null,
            paymentMethodAdded: false
        };
    },
    methods: {
        createPaymentElement() {
            if (!this.paymentsElement) {
                const options = {
                    clientSecret: this.clientSecret,
                    appearance: this.appearance,
                    locale: this.locale,
                    fields: {
                        billingDetails: {
                            name: 'auto',
                            email: 'auto',
                        }
                    },
                    wallets: {
                        googlePay: 'auto',
                        applePay: 'auto'
                    }
                };
                this.elements = this.stripe.elements(options);
                this.paymentsElement = this.elements.create('payment');
                this.paymentsElement.mount('#payment-element');
            }
        },
        setupIntent() {
            return api.post('/api/subscriptions/payment-methods/setup-intent')
                .then((response) => {
                    return response.data.data;
                })
                .then(data => {
                    this.clientSecret = data.client_secret;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        savePaymentMethod(pm) {
            let params = { payment_method: pm };
            return api.post('/api/subscriptions/payment-methods', params)
                .then((response) => {
                    localStorage.setItem('stripe_pm', true);
                    this.$emit('subscribeToPlan');
                    this.$router.push({ name: 'Products' });
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        async confirmSetup() {
            localStorage.setItem('startSubscription', true);
            this.loading = true;
            let options = {
                elements: this.elements,
                confirmParams: {
                    // Return URL where the customer should be redirected after the SetupIntent is confirmed.
                    return_url: this.redirectUrl,
                },
            };

            const { error } = await this.stripe.confirmSetup(options);
            this.loading = false;

            if (error) {
                localStorage.setItem('startSubscription', false);
                this.$store.dispatch(
                    'notifications/SHOW_ERROR_NOTIFICATION',
                    error.message
                );
            }
        },
        getPaymentMethod() {
            const clientSecret = new URLSearchParams(window.location.search).get(
                'setup_intent_client_secret'
            );

            if (clientSecret) {
                // Retrieve the SetupIntent
                this.stripe.retrieveSetupIntent(clientSecret).then(({setupIntent}) => {
                    // Inspect the SetupIntent `status` to indicate the status of the payment
                    // to your customer.
                    //
                    // Some payment methods will [immediately succeed or fail][0] upon
                    // confirmation, while others will first enter a `processing` state.
                    //
                    // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
                    switch (setupIntent.status) {
                        case 'succeeded': {
                            this.paymentMethodAdded = true;
                            this.savePaymentMethod(setupIntent.payment_method);
                            this.$store.dispatch(
                                'notifications/SHOW_SUCCESS_NOTIFICATION',
                                `Success! Your payment method has been saved.`
                            );
                            break;
                        }

                        case 'processing': {
                            this.$store.dispatch(
                                'notifications/SHOW_ERROR_NOTIFICATION',
                                "Processing payment details. We'll update you when processing is completed."
                            );
                            break;
                        }

                        case 'requires_payment_method': {
                            this.$store.dispatch(
                                'notifications/SHOW_ERROR_NOTIFICATION',
                                "Failed to process payment details. Please try another payment method."
                            );
                            // Redirect your user back to your payment page to attempt collecting
                            // payment again
                            break;
                        }
                    }
                });
            }
        },
        paymentElementsRenered() {
            setTimeout(() => {this.loading = false}, 500);
        }
    },
    async created() {
        this.loading = true;
        this.redirectUrl = `${window.location.origin}${this.$router.resolve({name: 'Payment'}).href}`;
        this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        this.getPaymentMethod();
        await this.setupIntent();
        await this.createPaymentElement();
        this.paymentsElement.on('ready', this.paymentElementsRenered);
    },
    beforeUnmount() {
        if (this.paymentsElement !== null) {
            this.paymentsElement.unmount();
        }
    }
};
</script>
