<template>
    <div
        v-if="!loading"
        class="h-100 column-start"
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
            <h1 class="f-28-black f-black">Add new user to existing business</h1>
        </div>
        <div class="row-start pt-40">
            <div class="lg-6 nb-8 md-12 sm-12 column-start">
                <div class="column-start lg-12">
                    <p class="f-13-black f-black mb-3">Add to existing business</p>
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
                @click="addUsersToBusiness"
            >
                Save Page
            </primary-button>
            <border-button
                @click="cancel"
            >
                Cancel
            </border-button>
        </div>
    </div>
    <loader v-else/>
</template>

<script>
import { ArrowShewron } from '@/icons';
import { fullName } from '@/helpers/commonHelpers.js';

export default {
    name: "AddUsersToExistingBusiness",
    components: {
        ArrowShewron
    },
    data() {
        return {
            loading: false,
            businessAccounts: [],
            selectedBusiness: null
        }
    },
    methods: {
        // Methods imported from helpers
        fullName,
        addUsersToBusiness() {
            if (!this.selectedBusiness) {
                this.$store.dispatch(
                    'notifications/SHOW_WARNING_NOTIFICATION',
                    `Select business owner.`
                );
                return;
            }
            let params = {};

            if (this.selectedBusiness) {
                params['business_user_id'] = this.selectedBusiness.id;
            }

            this.$store.dispatch('users/BIND_USER_TO_EXISTING_BUSINESS', params)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Users have been added successfully!`
                    );
                    this.$router.push({ name: 'Users' });
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
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
