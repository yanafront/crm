<template>
    <Form
        v-if="!tagBindedAuthUser"
        class="auth-form"
        :validation-schema="schema"
        @submit="handleSignUpForm"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <p class="f-20-black f-bold mb-20">Register new account</p>
        <form-input
            id="first_name"
            class="mb-25"
            label="First Name"
            name="first_name"
            placeholder="Your first name"
            :errors="errors"
        />
        <form-input
            id="last_name"
            class="mb-25"
            label="Last Name"
            name="last_name"
            placeholder="Your last name"
            :errors="errors"
        />
        <form-input
            id="email"
            class="mb-25"
            label="Email"
            name="email"
            placeholder="Your email"
            :errors="errors"
        />
        <form-input
            id="tag"
            class="mb-25"
            label="Tag"
            name="tag"
            placeholder="Your tag"
            disabled="true"
            :errors="errors"
            v-model="schema.tag"
            v-if="schema.tag"
        />
        <form-input
            id="password"
            class="mb-25"
            label="Password"
            name="password"
            placeholder="Your password"
            :errors="errors"
        />
        <div
            :class="[
                'row-between row-baseline',
                {'pb-20': !registerByTag}
            ]"
        >
            <p
                v-if="!registerByTag"
                @click="toLoginPage"
                class="lg-6 sm-12 pointer f-18-grey f-medium"
            >
                Already have an account? Log in
            </p>
            <div
                :class="[
                    {'row-center mt-3': mScreen},
                    {'column-end lg-12': registerByTag}
                ]"
            >
                <primary-button buttonType="submit">
                    <template v-if="!loading">
                        Sign Up
                    </template>
                    <template v-else>
                        <loader
                            size="mini"
                            loaderColor="white"
                            class="s-align-5"
                        />
                    </template>
                </primary-button>
                <div
                    v-if="registerByTag"
                    @click="showInstruction = !showInstruction"
                    class="mt-5 relative"
                >
                    <primary-button buttonType="button">
                        Connect product to existing account
                    </primary-button>
                    <p
                        v-if="showInstruction"
                        class="instruction-modal f-16-black"
                    >
                        <span>1) Login to your account</span>
                        <span>2) After logging in, stay logged in and scan the QR code</span>
                        <span>3) Select "bind" to bind this product to your existing account</span>
                    </p>
                </div>
            </div>
        </div>
        <p
            v-if="!registerByTag"
            class="row-end pt-20 f-18-grey f-medium bt-grey"
        >
            Check email after registering!
        </p>
    </Form>
    <Form
        v-else
        class="auth-form"
        :validation-schema="bindCardSchema"
        @submit="bindCard"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <p class="f-20-black f-bold mb-20">Bind tag to your primary card</p>
        <form-input
            id="tag"
            class="mb-25"
            label="Tag"
            name="code"
            placeholder="Your tag"
            disabled="true"
            :errors="errors"
            v-model="schema.tag"
        />
        <div class="row-end row-baseline">
            <div :class="{'row-center mt-3': mScreen}">
                <primary-button buttonType="submit">
                    <template v-if="!loading">
                        Bind
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
        </div>
    </Form>
</template>

<script>
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { mapGetters } from 'vuex';

export default {
    name: 'SignUp',
    components: {
        Form
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            first_name: yup.string().required().label('First name'),
            last_name: yup.string().required().label('Last name'),
            email: yup.string().required().email().label('Email'),
            password: yup.string().required().min(8).label('Password'),
            tag: yup.string().nullable().label('Tag'),
        });

        // Form validation schema
        const bindCardSchema = yup.object({
            code: yup.string().nullable().label('Tag'),
        });

        return {
            schema,
            bindCardSchema,
            loading: false,
            showInstruction: false
        }
    },
    computed: {
        ...mapGetters({
            tagBindedAuthUser: 'tags/tagBindedAuthUser'
        }),
        registerByTag() {
            return !!this.$route?.query?.tag || null;
        }
    },
    methods: {
        handleSignUpForm(values) {
            this.loading = true;
            let formData = values;

            this.$store.dispatch('auth/AUTH_SIGNUP', formData)
                .then((data) => {
                    if (data.id) {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Your account has been registered! \n Please check your email to confirm your email address!`
                        );
                        this.$router.push({ name: 'SignUpSuccess' });
                    }
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        bindCard(values) {
            this.loading = true;

            this.$store.dispatch('tags/BIND_TAG_TO_CARD', values)
                .then((data) => {
                    if (data.data.url) {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Your profile has been bound successfully!`
                        );
                        this.$router.push({ name: 'Profile' });
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
    mounted() {
        this.schema.tag = this.$route?.query?.tag || null;
    }
}
</script>

