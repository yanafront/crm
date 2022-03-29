<template>
    <Form
        class="auth-form"
        :autocomplete="false"
        :validation-schema="schema"
        @submit="handleForgotPasswordForm"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <p class="f-20-black f-bold mb-20">Forgot password?</p>
        <form-input
            id="email"
            class="mb-25"
            label="Email"
            name="email"
            placeholder="Your email"
            :errors="errors"
        />
        <div class="row-between row-baseline">
            <p
                @click="toLoginPage"
                class="lg-6 pointer f-14-grey f-medium"
            >
                Return to Log in
            </p>
            <primary-button buttonType="submit">
                <template v-if="!loading">
                    Send
                </template>
                <template v-else>
                    <loader
                        size="mini"
                        loaderColor="white"
                        class="s-align-5"
                    />
                </template>
            </primary-button>
        </div>
    </Form>
</template>

<script>
import { Form } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'ForgotPassword',
    components: {
        Form
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            email: yup.string().required().email().label('Email')
        });

        return {
            schema,
            loading: false
        }
    },
    methods: {
        handleForgotPasswordForm(values) {
            this.loading = true;
            let formData = values;

            this.$store.dispatch('auth/FORGOT_PASSWORD', formData)
                .then((data) => {
                    if (data.success) {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            data.status
                        );
                    } else {
                        this.$store.dispatch(
                            'notifications/SHOW_ERROR_NOTIFICATION',
                            data.status
                        );
                    }
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
        toLoginPage() {
            this.$router.push({ name: 'Login' });
        }
    },
}
</script>
