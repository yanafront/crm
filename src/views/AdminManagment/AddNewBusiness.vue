<template>
    <Form
        v-if="!loading"
        class="h-100 column-start"
        :validation-schema="schema"
        :initial-values="formValues"
        @submit="submitForm"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <div
            class="lg-12 row-baseline pointer mb-8 f-15-grey"
            @click="$router.push({ name: 'Users' })"
        >
            <arrow-shewron
                :transform="180"
                width="14"
                height="14"
                class="i-green mr-2"
            />
            All Users
        </div>
        <div class="column-start">
            <h1 class="f-28-black f-black">Add Business Account</h1>
        </div>
        <div class="row-start pt-40">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Profile</h2>
                <p class="f-14-grey f-medium mt-20">Your shareable contact information <br /> for the Public Profile.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <div class="row-start mb-25">
                    <form-input
                        id="business_name"
                        class="lg-12"
                        label="Company name"
                        name="company_name"
                        placeholder="Company name"
                        :errors="errors"
                    />
                </div>
                <div class="column-start mb-25 lg-12">
                    <form-input
                        id="business_owner"
                        class="lg-12"
                        label="Contact person"
                        name="first_name"
                        placeholder="Contact person"
                        :errors="errors"
                    />
                </div>
                <div class="column-start mb-25 lg-12">
                    <form-input
                        id="phone"
                        class="lg-12"
                        name="phone"
                        label="Phone number"
                        placeholder="Phone number"
                        :errors="errors"
                        v-maska="'+1 (###) ###-####'"
                    />
                </div>
                <div class="column-start mb-25 lg-12">
                    <form-input
                        id="email"
                        class="lg-12"
                        label="Email"
                        name="email"
                        placeholder="User email"
                        :errors="errors"
                    />
                </div>
                <div class="column-start mb-25 lg-12">
                    <form-input
                        id="password"
                        class="lg-12"
                        label="Password"
                        name="password"
                        placeholder="User password"
                        :errors="errors"
                    />
                </div>
                <div class="column-start lg-12">
                    <form-input
                        id="code"
                        class="lg-12"
                        label="Unique URL"
                        name="code"
                        placeholder="Unique URL"
                        :errors="errors"
                    />
                </div>
            </div>
        </div>
        <div class="page-button-panel w-100">
            <primary-button
                class="mr-5"
                buttonType="submit"
            >
                Save Page
            </primary-button>
            <border-button
                @click="cancel"
            >
                Cancel
            </border-button>
        </div>
    </Form>
    <loader v-else/>
</template>

<script>
import { ArrowShewron } from '@/icons';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import "yup-phone";
import { getErrorsFields } from '@/helpers/commonHelpers.js';

export default {
    name: "AddNewUser",
    components: {
        ArrowShewron,
        Form
    },
    data() {
        return {
            // Initial values
            formValues: {
                company_name: '',
                first_name: '',
                phone: '',
                email: '',
                password: '',
                code: ''
            },
            loading: false
        }
    },
    computed: {
        // Dynamic Form validation schema
        schema() {
            let baseRules = {
                company_name: yup.string().required().label('Business name'),
                first_name: yup.string().required().label('Contact person'),
                phone: yup.string().phone("US").required().label('Phone number'),
                email: yup.string().email().required().label('Email'),
                password: yup.string().required().min(8).label('Password'),
                code: yup.string().required().label('Unique URL')
            }

            return yup.object(baseRules);
        }
    },
    methods: {
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        submitForm(values, actions) {
            this.$store.dispatch('users/CREATE_BUSINESS_BY_SUPERADMIN', values)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Business profile has been created successfully!`
                    );
                    this.loading = false;
                    this.$store.commit('users/SET_SELECTED_USER', []);
                    this.$router.push({ name: 'Users' });
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    actions.setErrors(getErrorsFields(error));
                });
        },
        cancel() {
            this.$router.push({ name: 'Users' });
        },
    }
}
</script>
