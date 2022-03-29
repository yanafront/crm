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
        <div class="row-start pv-40">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Profile</h2>
                <p class="f-14-grey f-medium mt-20">Your shareable contact information <br /> for the Public Profile.</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <photo-cropper
                    v-if="!loading && cardInfo"
                    :cardId="cardInfo?.card_id"
                    :cardImage="cardInfo?.image"
                    @croppedAvatar="addAvatar"
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
                <div class="column-start mb-25 lg-12">
                    <p class="f-13-black f-black mb-3">Phone</p>
                    <div
                        :class="[
                            'row-start lg-12 md-12 sm-12',
                            {'mt-25': i !== 0 }
                        ]"
                        v-for="(phone, i) in phones"
                        :key="i"
                    >
                        <div class="lg-3 sm-4">
                            <select-input
                                class="mr-8"
                                :options="options"
                                :default="phone"
                                @input="setPhoneType($event, i)"
                            />
                        </div>
                        <div class="row-start flex-no-wrap lg-9 sm-8">
                            <form-input
                                id="phone"
                                class="w-100 mr-sm-0"
                                :name="`phone_${i}`"
                                placeholder="Your phone number"
                                :errors="errors"
                                v-maska="'+1 (###) ###-####'"
                                v-model="phone.number"
                            />
                            <icon-button
                                v-show="phones.length > 1 && i !== 0"
                                class="mt-1 ml-5"
                                width="30"
                                height="30"
                                color="grey"
                                @click="removePhone(i)"
                            >
                                <trash-icon />
                            </icon-button>
                        </div>
                    </div>
                    <button
                        v-show="phones.length < 2"
                        class="transparent-button f-14-blue f-sbold mt-4"
                        type="button"
                        @click="addPhone"
                    >
                        + Add additional phone number
                    </button>
                </div>
                <div class="column-start mb-25 lg-12">
                    <template
                        v-for="(item, i) in emails"
                        :key="i"
                    >
                        <div
                            :class="[
                                'row-baseline flex-no-wrap lg-12 md-12 sm-12',
                                {'mt-25': i !== 0 }
                            ]"
                        >
                            <form-input
                                id="email"
                                class="lg-12"
                                :label="i === 0 ? 'Primary Email' : 'Email'"
                                :name="`email_${i}`"
                                placeholder="Your email"
                                :errors="errors"
                            />
                            <icon-button
                                v-show="emails.length > 1 && i !== 0"
                                class="mt-20 ml-5"
                                width="30"
                                height="30"
                                color="grey"
                                @click="removeEmail(i)"
                            >
                                <trash-icon />
                            </icon-button>
                        </div>
                    </template>
                    <button
                        v-show="emails.length < 2"
                        class="transparent-button f-14-blue f-sbold mt-4"
                        type="button"
                        @click="addEmail"
                    >
                        + Add another email
                    </button>
                </div>
                <div class="row-start lg-12">
                    <div class="lg-6 md-6 sm-12 mb-sm-1">
                        <form-input
                            id="company"
                            class="w-100 pr-4 pr-sm-0"
                            label="Company"
                            name="company_name"
                            placeholder="Your company name"
                            :errors="errors"
                        />
                    </div>
                    <div class="lg-6 md-6 sm-12">
                        <form-input
                            id="position"
                            class="w-100 pl-4 pl-sm-0"
                            label="Position"
                            name="job_title"
                            placeholder="Your position"
                            :errors="errors"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!isPrimaryCard && !createMode"
            class="row-start pv-40 bt-grey"
        >
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Delete Page</h2>
                <p class="f-14-grey f-medium mt-20">Delete this page account and account data</p>
            </div>
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <danger-button @click="deleteCardConfirm = true">
                    Delete Page and Settings
                </danger-button>
            </div>
        </div>
        <modal
            v-if="deleteCardConfirm"
            @close="deleteCardConfirm = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 w-90 t-center pl-50">
                    Delete Page
                </h1>
            </template>
            <template #body>
                <p class="f-13-darkgrey t-center s-align-5 w-100">
                    This action will delete this page. Are you sure?
                </p>
                <div class="row-center mt-40">
                    <primary-button
                        class="mr-5"
                        @click="deleteCard"
                    >
                        Yes
                    </primary-button>
                     <primary-button
                        @click="deleteCardConfirm = false"
                    >
                        No
                    </primary-button>
                </div>
            </template>
        </modal>
        <div class="page-button-panel w-100">
            <primary-button
                class="mr-5"
                buttonType="submit"
            >
                <template v-if="createMode">Create Page</template>
                <template v-else>Save Page</template>
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
import { TrashIcon } from '@/icons';
import { Form } from 'vee-validate';
import { PhotoCropper } from '@/components';
import Modal from '@/ui/modal/Modal.vue';
import * as yup from 'yup';
import "yup-phone";
import { mapGetters } from 'vuex';
import { PHONE_TYPE } from '@/constants';

const CREATE_MODE = 'create-new';
const EDIT_MODE = 'edit';

export default {
    name: 'EditProfile',
    components: {
        TrashIcon,
        Form,
        PhotoCropper,
        Modal
    },
    data() {
        return {
            // Initial values
            formValues: {
                first_name: '',
                last_name: '',
                company_name: '',
                job_title: '',
            },
            loading: false,
            options: [
                {
                    title: 'Home',
                    type: PHONE_TYPE.CELL
                },
                {
                    title: 'Work',
                    type: PHONE_TYPE.WORK
                }
            ],
            phones: [
                {
                    number: '',
                    type: PHONE_TYPE.CELL
                }
            ],
            emails: [
                {
                    email: '',
                    type: 'work'
                }
            ],
            avatarPhoto: null,
            deleteCardConfirm: false
        }
    },
    computed: {
        ...mapGetters({
            primaryCard: 'cards/getUserCard',
            cardById: 'cards/getCardByCardId',
            userRole: 'user/getUserRole',
        }),
        // Dynamic Form validation schema
        schema() {
            let baseRules = {
                first_name: yup.string().required().label('First name'),
                last_name: yup.string().required().label('Last name'),
                phone_0: yup.string().phone("US").required().label('Phone number'),
                email_0: yup.string().email().label('Primary email'),
                company_name: yup.string().label('Company'),
                job_title: yup.string().label('Position'),
            }

            if (this.emails.length === 2) {
                baseRules['email_1'] = yup.string().email().label('Email');
            }

            if (this.phones.length === 2 && this.phones[1].number) {
                baseRules[`phone_1`] = yup.string().phone("US").required(false).label('Phone number');
            }

            return yup.object(baseRules);
        },
        createMode() {
            return this.$route.query?.mode === CREATE_MODE;
        },
        editMode() {
            return this.$route.query?.mode === EDIT_MODE;
        },
        cardInfo() {
            if (this.createMode) {
                return {};
            }

            if (this.editMode) {
                return this.cardById(this.$route.query.card_id);
            }

            return this.primaryCard;
        },
        isPrimaryCard() {
            return !!this.cardInfo?.is_primary;
        }
    },
    methods: {
        getCardsByAuthUser() {
            this.loading = true;
            this.$store.dispatch('cards/GET_CARDS_BY_AUTH_USER')
                .then((data) => {
                    this.setFormsInitialValues();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        addEmail() {
            this.emails.push({
                email: '',
                type: 'work'
            });
        },
        removeEmail(index) {
            this.emails.splice(index, 1);
        },
        addPhone() {
            this.phones.push({
                number: '',
                type: PHONE_TYPE.CELL
            });
        },
        removePhone(index) {
            this.phones.splice(index, 1);
        },
        setPhoneType(val, index) {
            this.phones[index].type = val.curentOption.type.toLowerCase();
        },
        cancel() {
            this.$router.push({ name: 'Profile' });
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
            this.phones.forEach((item, index) => {
                if (values[`phone_${index}`]) {
                    this.phones[index].number = values[`phone_${index}`];
                    delete values[`phone_${index}`];
                }
            });

            this.emails.forEach((item, index) => {
                this.emails[index].email = values[`email_${index}`];
                delete values[`email_${index}`];
            });

            let params = {
                phones: this.phones.filter(el => {
                    if (el.number) return el;
                }),
                emails: this.emails.filter(el => {
                    if (el.email) return el;
                }),
                ...formData
            };

            if (this.createMode) {
                let formDataParams = new FormData();

                if (Object.keys(values).length) {
                    Object.keys(values).forEach(el => {
                        if (values[el]) {
                            formDataParams.append(el, values[el]);
                        }
                    });
                }

                this.phones.forEach((phone, index) => {
                    if (phone.number) {
                        if (Object.keys(phone).length) {
                            Object.keys(phone).forEach(el => {
                                formDataParams.append(`phones[${index}][${el}]`, phone[el]);
                            });
                        }
                    }
                });

                this.emails.forEach((email, index) => {
                    if (email.email) {
                        if (Object.keys(email).length) {
                            Object.keys(email).forEach(el => {
                                formDataParams.append(`emails[${index}][${el}]`, email[el]);
                            });
                        }
                    }
                });

                if (this.avatarPhoto) {
                    formDataParams.append(`image`, this.avatarPhoto);
                }

                this.$store.dispatch('cards/CREATE_NEW_CARD', formDataParams)
                    .then((data) => {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Your profile has been created successfully!`
                        );
                        this.loading = false;
                        this.$router.push({ name: 'Profile' });
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    })
                    .finally(() => this.loading = false);
            } else {
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
                        this.$router.push({ name: 'Profile' });
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    })
                    .finally(() => this.loading = false);
            }
        },
        setFormsInitialValues() {
            this.formValues.first_name = this.cardInfo?.first_name || "";
            this.formValues.last_name = this.cardInfo?.last_name || "";
            this.formValues.company_name = this.cardInfo?.company_name || "";
            this.formValues.job_title = this.cardInfo?.job_title || "";

            if (this.cardInfo.phones.length) {
                this.cardInfo.phones.forEach((item, index) => {
                    if (index === 1 && this.phones.length === 1) {
                        this.addPhone();
                    }

                    this.formValues[`phone_${index}`] = this.cardInfo.phones[index].number;
                    this.phones[index].type = item.type;
                    this.phones[index].id = item.id;
                });
            }

            if (this.cardInfo.emails.length) {
                this.cardInfo.emails.forEach((item, index) => {
                    if (index === 1 && this.emails.length === 1) {
                        this.addEmail();
                    }

                    this.formValues[`email_${index}`] = this.cardInfo.emails[index].email;
                    this.emails[index].type = item.type;
                    this.emails[index].id = item.id;
                });
            }
        },
        addAvatar(data) {
            this.avatarPhoto = data;
        },
        deleteCard() {
            this.$store.dispatch('cards/DELETE_NOT_PRIMARY_CARD', this.cardInfo.card_id)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your page has been deleted!`
                    );
                    this.$router.push({ name: 'Profile' });
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    mounted() {
        if (this.createMode) {
            return;
        }

        if (!this.cardInfo || !Object.keys(this.cardInfo).length) {
            this.getCardsByAuthUser();
        }

        if (this.cardInfo && Object.keys(this.cardInfo).length) {
            this.setFormsInitialValues();
        }
    }
}
</script>
