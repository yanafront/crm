<template>
    <Form
        class="auth-form"
        :validation-schema="schema"
        @submit="handleLoginForm"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <p class="f-20-black f-bold mb-20">Log in to your account</p>
        <form-input
            id="username"
            class="mb-25"
            label="Email"
            name="username"
            placeholder="Your email"
            :errors="errors"
        />
        <form-input
            id="password"
            class="mb-25"
            label="Password"
            name="password"
            fieldType="password"
            placeholder="Your password"
            :errors="errors"
        />
        <div class="row-between">
            <div>
                <primary-button @click="toSignUpPage">
                    Sign Up
                </primary-button>
            </div>
            <div class="column-end">
                <primary-button buttonType="submit">
                    <template v-if="!loading">
                        Login
                    </template>
                    <template v-else>
                        <loader
                            size="mini"
                            loaderColor="white"
                            class="s-align-5"
                        />
                    </template>
                </primary-button>
                <p
                    @click="toForgotPasswordPage"
                    class="mt-5 pointer f-18-grey f-medium"
                >
                    Forgot password?
                </p>
            </div>
        </div>
    </Form>
</template>

<script>
import { Form } from 'vee-validate';
import * as yup from 'yup';

const CLIENT_SECRET = "j8LClVegkO7auFUTcQsk6LYozUVkVuC85A46ixDP";

export default {
    name: 'Login',
    components: {
        Form
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            username: yup.string().required().email().label('Email'),
            password: yup.string().required().min(8).label('Password')
        });

        return {
            loading: false,
            schema,
            emailIsVerified: null
        }
    },
    methods: {
        async handleLoginForm(values, { resetForm }) {
            this.loading = true;
            let formData = {
                grant_type: "password",
                client_id: 2,
                client_secret: CLIENT_SECRET,
                ...values
            };

            await this.$store.dispatch('auth/AUTH_LOGIN', formData)
                .then((data) => {
                    this.$store.dispatch('auth/CHECK_VERIFIED_USER')
                        .then((data) => {
                            if (data.email_verified_at) {
                                this.$store.commit('user/SET_AUTH_USER_INFO', data);
                                resetForm();
                                this.$router.push({ name: 'Profile' });
                            } else {
                                this.$router.push({ name: 'UnverifiedEmail' });
                            }
                        })
                        .catch(error => {
                            this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                        })
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        toForgotPasswordPage() {
            this.$router.push({ name: 'ForgotPassword' });
        },
        toSignUpPage() {
            this.$router.push({ name: 'SignUp' });
        }
    },
    mounted() {
        this.emailIsVerified = this.$route.query
            && this.$route.query.verification_status
            ? this.$route.query.verification_status
            : null;

        if (!!this.emailIsVerified) {
            this.$store.dispatch(
                'notifications/SHOW_SUCCESS_NOTIFICATION',
                `Your email has been verified successfully!`
            );
        }
    }
}
</script>
