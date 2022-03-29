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
            <h1 class="f-28-black f-black">Add new user</h1>
        </div>
        <div class="row-start pt-40">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Profile</h2>
                <p class="f-14-grey f-medium mt-20">Your shareable contact information <br /> for the Public Profile.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
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
                <div class="column-start mb-25 lg-12">
                    <form-input
                        id="unique_url"
                        class="lg-12"
                        label="Unique URL"
                        name="code"
                        placeholder="Unique URL"
                        :errors="errors"
                    />
                </div>
                <div class="column-start lg-12">
                    <p class="f-13-black f-black mb-3">Link to business</p>
                    <vue-select
                        class="w-100"
                        :options="businessAccounts"
                        label-by="id"
                        close-on-select
                        v-model="selectedBusiness"
                    >
                        <template #label="{ selected }">
                            <template v-if="selected">
                                <div>
                                    {{ fullName(selected) }}
                                </div>
                            </template>
                            <template v-else>Select business owner</template>
                        </template>
                        <template #dropdown-item="{ option }">
                            <div>
                                {{ fullName(option) }}
                            </div>
                        </template>
                    </vue-select>
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
import { fullName, getErrorsFields } from '@/helpers/commonHelpers.js';

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
                email: '',
                password: '',
                code: ''
            },
            loading: false,
            businessAccounts: [],
            selectedBusiness: null
        }
    },
    computed: {
        // Dynamic Form validation schema
        schema() {
            let baseRules = {
                email: yup.string().email().required().label('Email'),
                password: yup.string().required().min(8).label('Password'),
                code: yup.string().required().label('Unique URL')
            }

            return yup.object(baseRules);
        }
    },
    methods: {
        // Methods imported from helpers
        fullName,
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        submitForm(values, actions) {
            let formData = values;

            if (this.selectedBusiness) {
                formData['parent_id'] = this.selectedBusiness.id;
            }

            this.$store.dispatch('users/CREATE_USER_BY_SUPERADMIN', formData)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `User profile has been created successfully!`
                    );
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
        getBusiness() {
            this.$store.dispatch('users/GET_ALL_BUSINESS')
                .then((data) => {
                    this.businessAccounts.push(...data.data);
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    created() {
        this.getBusiness();
    }
}
</script>
