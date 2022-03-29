<template>
    <div
        v-if="!loading"
        class="public-profile-page"
    >
        <public-profile-card
            v-if="Object.keys(publicCardInfo).length"
            class="mb-20"
            :cardInfo="publicCardInfo"
            :saveVisitorActions="saveVisitorActions"
            @shareContact="showModal = true"
        />
        <content-section
            :publicCardId="cardId"
            :showOnPublicProfile="true"
        />
        <powered-by v-if="!hidePoweredBy"/>
        <modal
            class="share-contact-modal"
            v-if="showModal"
            :showCloseButton="false"
            @close="showModal = false"
        >
            <template v-slot:title>
                <h1 class="f-20-black f-bold mb-2 t-center">
                    Share your contact with <br /> {{ fullName }}
                </h1>
            </template>
            <template v-slot:body>
                <Form
                    :validation-schema="schema"
                    @submit="handleContactForm"
                    @invalid-submit="onInvalidSubmit"
                    v-slot="{ errors }"
                >
                    <form-input
                        id="name"
                        class="mb-20"
                        label="Name"
                        name="name"
                        placeholder="Name"
                        :errors="errors"
                    />
                    <form-input
                        id="number"
                        class="mb-20"
                        label="Number"
                        name="phone"
                        placeholder="Number"
                        v-maska="'+1 (###) ###-####'"
                        :errors="errors"
                    />
                    <form-input
                        id="email"
                        class="mb-20"
                        label="Email"
                        name="email"
                        placeholder="Email"
                        :errors="errors"
                    />
                    <form-input
                        id="company"
                        class="mb-20"
                        label="Company"
                        name="company_name"
                        placeholder="Company"
                        :errors="errors"
                    />
                    <div class="row-center">
                        <primary-button
                            class="w-100"
                            buttonType="submit"
                        >
                            Send
                        </primary-button>
                    </div>
                </Form>
            </template>
        </modal>
    </div>
    <loader v-else />
</template>

<script>
import { PublicProfileCard, PoweredBy, ContentSection } from '@/components';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Modal from '@/ui/modal/Modal.vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import "yup-phone";
import { mapGetters } from 'vuex';
import { removeEmptyFields } from '@/helpers/commonHelpers.js';

export default {
    name: "PublicProfile",
    components: {
        PublicProfileCard,
        PoweredBy,
        ContentSection,
        Modal,
        Form
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            name: yup.string().required().label('Name'),
            phone: yup.string().phone("US").label('Phone number'),
            email: yup.string().required().email().label('Email')
        });

        return {
            schema,
            loading: false,
            showModal: false
        }
    },
    computed: {
        ...mapGetters({
            publicCardInfo: 'cards/getPublicCard'
        }),
        fullName() {
            let fullName = '';
            if (Object.keys(this.publicCardInfo).length) {
                fullName = this.publicCardInfo?.first_name || '';
                fullName += ` ${this.publicCardInfo?.last_name}` || '';
            }

            return fullName;
        },
        cardId() {
            return this.publicCardInfo?.card_id;
        },
        hidePoweredBy() {
            return this.publicCardInfo?.hide_powered_by;
        },
        saveVisitorActions() {
            if (this.$route?.query?.mode) {
                return false;
            }

            return true;
        }
    },
    methods: {
        getCardsByUniqueLink() {
            this.loading = true;
            this.$store.dispatch('cards/GET_CARDS_BY_UNIQUE_LINK', this.$route.path)
                .then(data => {
                    if (!data.is_primary) {
                        this.$router.push({ name: 'NotFound'});
                        return;
                    }
                })
                .catch(error => {
                    if (error?.response?.status === 404) {
                        this.$router.push({ name: 'NotFound'});
                        return;
                    }

                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        setDeviceId(deviceId) {
            this.$store.dispatch('analytics/SET_DEVICE_ID', deviceId);
        },
        handleContactForm(values) {
            let formData = {
                ...values,
                card_id: this.publicCardInfo?.card_id
            };
            removeEmptyFields(formData);

            this.$store.dispatch('contacts/SAVE_CONTACT', formData)
                .then((data) => {
                    this.showModal = false;
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your contact has been saved successfully!`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        }
    },
    async created() {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();

        if (this.saveVisitorActions) {
            this.setDeviceId(result.visitorId);
        }
    },
    beforeUnmount() {
        this.$store.commit('cards/REMOVE_PUBLIC_CARD_INFO', {});
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getCardsByUniqueLink();
        });
    }
}
</script>
