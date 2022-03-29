<template>
    <Form
        v-if="!loading"
        class="h-100 column-start"
        :validation-schema="schema"
        :initial-values="formValues"
        @submit="handleUpdateCard"
        @invalid-submit="onInvalidSubmit"
        v-slot="{ errors }"
    >
        <div class="column-start">
            <h1 class="f-28-black f-black">Profile Settings</h1>
            <p class="f-18-grey f-medium mt-4">This is what people download when they save your contact information.</p>
        </div>
        <div class="row-start pv-40 bb-grey">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Profile</h2>
                <p class="f-14-grey f-medium mt-20">Your shareable contact information <br> for the Public Profile.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <photo-cropper
                    v-if="cardInfo?.card_id"
                    :cardId="cardInfo.card_id"
                    :cardImage="cardInfo.image"
                />
                <div class="row-start mb-25">
                    <div class="lg-6 md-6 sm-12">
                        <form-input
                            id="first_name"
                            class="w-100 pr-4 pr-sm-0 mb-sm-1"
                            label="First name"
                            name="first_name"
                            placeholder="Your first name"
                            :errors="errors"
                        />
                    </div>
                    <div class="lg-6 md-6 sm-12">
                        <form-input
                            id="last_name"
                            class="w-100 pl-4 pl-sm-0"
                            label="Last name"
                            name="last_name"
                            placeholder="Your last name"
                            :errors="errors"
                        />
                    </div>
                </div>
                <div class="row-start lg-12">
                    <div class="lg-12 md-12 sm-12">
                        <form-input
                            id="company"
                            class="w-100 pr-sm-0"
                            label="Unique URL"
                            name="code"
                            placeholder="Your unique URL"
                            :errors="errors"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="row-start pv-40 bb-grey">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Password</h2>
                <p class="f-14-grey f-medium mt-20">Set new password.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <div class="row-start lg-12">
                    <div class="lg-12 md-12 sm-12">
                        <form-input
                            id="company"
                            class="w-100 pr-sm-0"
                            label="New Password"
                            name="password"
                            placeholder="New Password"
                            :errors="errors"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!isBusinessAdmin"
            class="row-start pv-40 bb-grey"
        >
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Deactivate User</h2>
                <p class="f-14-grey f-medium mt-20">Delete users data.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <div class="row-start lg-12">
                    <div class="lg-12 md-12 sm-12">
                        <danger-button
                            class="mr-5"
                            @click="confirmDeactivateUser = true"
                        >
                            Deactivate User
                        </danger-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-button-panel w-100">
            <primary-button class="mr-5" buttonType="submit">Save Page</primary-button>
            <border-button
                @click="backToPreviousRoute"
            >
                Cancel
            </border-button>
        </div>
    </Form>
    <loader v-else/>
    <modal
        v-if="confirmDeactivateUser"
        @close="confirmDeactivateUser = false"
    >
        <template #title>
            <h1 class="f-20-black f-bold mb-2 t-center">
                Deactivate User
            </h1>
        </template>
        <template #description>
            <p class="f-13-darkgrey">Are you sure you would like to deactivate this user?</p>
        </template>
        <template #body>
            <div class="row-end">
                <border-button
                    class="mr-6"
                    @click="confirmDeactivateUser = false"
                >
                    Cancel
                </border-button>
                <danger-button @click="deactivateUser">
                    Deactivate
                </danger-button>
            </div>
        </template>
    </modal>
</template>

<script>
import { TrashIcon } from '@/icons';
import { Form } from 'vee-validate';
import { PhotoCropper } from '@/components';
import { USER_ROLES } from '@/constants';
import Modal from '@/ui/modal/Modal.vue';
import * as yup from 'yup';
import { mapGetters } from 'vuex';

export default {
    name: 'EditUser',
    components: {
        TrashIcon,
        Form,
        PhotoCropper,
        Modal
    },
    data() {
        return {
            userId: null,
            // Initial values
            formValues: {
                first_name: '',
                last_name: '',
                code: '',
                password: '',
            },
            loading: false,
            confirmDeactivateUser: false,
            fromBusinessList: false,
            businessUserId: null,
            editedUserRole: ''
        }
    },
    computed: {
        ...mapGetters({
            cardInfo: 'cards/getUserCard',
            userRole: 'user/getUserRole',
        }),
        // Dynamic Form validation schema
        schema() {
            let baseRules = {
                first_name: yup.string().required().label('First name'),
                last_name: yup.string().required().label('Last name'),
                code: yup.string().required().label('Unique URL'),
                password: yup.string().label('Password'),
            }

            return yup.object(baseRules);
        },
        isBusinessAdmin() {
            return this.editedUserRole === USER_ROLES.BUSINESS_PAID
                || this.editedUserRole === USER_ROLES.BUSINESS;
        }
    },
    methods: {
        getCardsByUser(userId) {
            this.loading = true;
            this.$store.dispatch('cards/GET_CARDS_BY_USER_ID', userId)
                .then((data) => {
                    this.setFormsInitialValues();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        backToPreviousRoute() {
            if (this.fromBusinessList) {
                this.$router.push({
                    name: 'BusinessUsersList',
                    query: {
                        businessUserId: this.businessUserId
                    }
                });
            } else {
                this.$router.push({ name: 'Users' });
            }
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        handleUpdateCard(values) {
            let formData = values;
            this.loading = true;

            if (formData.password.length === 0) {
                delete formData.password;
            }

            let params = {
                ...formData
            };

            let requestPayload = {
                params,
                cardId: this.cardInfo.card_id
            };

            this.$store.dispatch('cards/UPDATE_CARD', requestPayload)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your profile has been updated successfully!`
                    );
                    this.loading = false;
                    this.backToPreviousRoute();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        setFormsInitialValues() {
            this.formValues.first_name = this.cardInfo?.first_name || "";
            this.formValues.last_name = this.cardInfo?.last_name || "";
            this.formValues.code = this.cardInfo?.code || "";
        },
        deactivateUser() {
            this.$store.dispatch('users/DEACTIVATE_USER', this.userId)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `User has been deactivated successfully!`
                    );
                    this.loading = false;
                    this.backToPreviousRoute();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        }
    },
    mounted() {
        this.userId = this.$route.params.user;
        this.editedUserRole = this.$route.params.user_role
            || localStorage.getItem('editedUserole');
        this.getCardsByUser(this.userId);
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (from.name === 'BusinessUsersList') {
                vm.fromBusinessList = true;
                vm.businessUserId = from.query.businessUserId;
            }
        });
    },
    beforeRouteLeave (to, from, next) {
        this.$store.commit('cards/SET_CARD_INFO', []);
        next();
    },
    unmounted() {
        this.fromBusinessList = false;
        this.businessUserId = null;
        localStorage.removeItem('editedUserole');
    }
}
</script>
