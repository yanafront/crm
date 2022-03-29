<template>
    <div class="column-center s-align-5 w-100 ph-8">
        <div class="service-layout_stub column-center t-center">
            <h1 class="f-24-black f-extrabold mb-6">Your account has been registered. <br />You need to verify it.</h1>
            <p class="f-14-darkgrey">Please check your email or resend your verification email by clicking the button below.</p>
            <p class="mt-30">
                <primary-button
                    :style="{width: '205px'}"
                    @click="resendVerificationMail"
                >
                    <template v-if="!loading">
                        Resend verification email
                    </template>
                    <template v-else>
                        <loader
                            size="mini"
                            loaderColor="white"
                            class="s-align-5"
                        />
                    </template>
                </primary-button>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UnverifiedEmail',
    data() {
        return {
            loading: false,
            emailVerifiedLinkExpired: null
        }
    },
    methods: {
        resendVerificationMail() {
            this.loading = true;
            this.$store.dispatch('auth/RESEND_VERIFICATION_EMAIL')
                .then((data) => {
                    if (data.success) {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Please check your email and click on the confirmation link to verify your email address.`
                        );
                        localStorage.removeItem('user-email');
                    }
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        }
    },
    mounted() {
        this.emailVerifiedLinkExpired = this.$route?.query?.email;

        if (this.emailVerifiedLinkExpired) {
            this.$store.dispatch(
                'notifications/SHOW_ERROR_NOTIFICATION',
                `Your email verification link has expired. Click “Resend verification email” button.`
            );
            localStorage.setItem('user-email', this.emailVerifiedLinkExpired);
        }
    }
}
</script>
