<template>
    <Form
        class="auth-form"
        :validation-schema="schema"
        :initial-values="formValues"
        @submit="handleResetPasswordForm"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <p class="f-20-black f-bold mb-20">Reset your password</p>
        <form-input
            id="email"
            class="mb-25"
            label="Email"
            name="email"
            placeholder="Your email"
            :errors="errors"
        />
        <form-input
            id="password"
            class="mb-25"
            label="New password"
            name="password"
            fieldType="password"
            placeholder="Your new password"
            :errors="errors"
        />
        <div class="row-end row-baseline">
            <primary-button buttonType="submit">
                <template v-if="!loading">
                    Reset
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
    name: 'ResetPassword',
    components: {
        Form
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            email: yup.string().required().email().label('Email'),
            password: yup.string().required().min(8).label('Password')
        });

        return {
            loading: false,
            schema,
            // Initial values
            formValues: {
                email: ''
            },
            email: null,
            token: null
        }
    },
    methods: {
        async handleResetPasswordForm(values) {
            this.loading = true;
            let formData = {
                ...values
            };
            formData.token = this.token;

            await this.$store.dispatch('auth/RESET_PASSWORD', formData)
                .then((data) => {
                    if (data.success) {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            data.status
                        );
                        this.$router.push({ name: 'Login' });
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
        }
    },
    mounted() {
        this.token = this.$route?.query?.token || null;
        this.email = this.$route?.query?.email || null;

        if (this.email) {
            this.formValues.email = this.email;
        }
    }
}
</script>
