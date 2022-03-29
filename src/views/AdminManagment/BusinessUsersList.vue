<template>
    <div
        class="column-start h-100"
        v-if="!loading"
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
        <div class="column-start mb-40">
            <h1 class="f-28-black f-black">Users</h1>
            <p class="f-18-grey f-medium mt-4">Users in your business.</p>
        </div>
        <div
            v-if="businessUsers.length"
            class="w-100 h-100"
        >
            <dynamic-table
                :header="tableData.tableHeader"
                :tableData="businessUsers"
                :optionsForRender="tableData.optionsForRender"
                @showWipeOutModal="showWipeOutModal"
                @showRemoveFromBusinessModal="showRemoveFromBusinessModal"
            />
            <!-- TODO; Use for pagination
                <div class="row-center pv-8">
                <load-more
                    v-if="isMorePages"
                    :status="loadingStatus"
                    @click="getUsers"
                />
            </div> -->
            <wipe-out-modal
                v-if="wipeOutModalShow"
                :cardId="wipeOutCardId"
                @getUsers="updateUsersList"
                @close="wipeOutModalShow = false"
            />
        </div>
        <div
            v-else
            class="h-100 w-100 s-align-5"
        >
            <p class="f-18-grey">Your page is empty</p>
        </div>
        <modal
            v-if="removeUserConfirm"
            @close="closeRemoveFromBusinessModal"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 t-center">
                    Remove user from business
                </h1>
            </template>
            <template #description>
                <p class="f-13-darkgrey">This will delete user from business. Are you sure?</p>
            </template>
            <template #body>
                <div class="row-end">
                    <border-button
                        class="mr-6"
                        @click="closeRemoveFromBusinessModal"
                    >
                        No
                    </border-button>
                    <danger-button @click="removeUserFromBusiness">
                        Yes
                    </danger-button>
                </div>
            </template>
        </modal>
    </div>
    <loader v-else />
</template>

<script>
import { DynamicTable, WipeOutModal } from '@/components';
import Modal from '@/ui/modal/Modal.vue';
import { ArrowShewron } from '@/icons';

export default {
    name: "BusinessUsersList",
    components: {
        DynamicTable,
        WipeOutModal,
        Modal,
        ArrowShewron
    },
    data() {
        return {
            loading: false,
            businessUsers: [],
            businessUserId: null,
            tableData: {
                tableHeader: ['Name', 'Number', 'Email', 'Unique URL', 'Wipe out', 'Remove from Business'],
                optionsForRender: ['full_name', 'phone', 'email', 'code', 'wipe_out_button', 'remove']
            },
            wipeOutModalShow: false,
            wipeOutCardId: null,
            removeUserConfirm: false,
            userIdForRemove: null
        }
    },
    computed: {
    },
    methods: {
        getUsers() {
            this.loading = true;
            let params = {
                perPage: 20
            };

            let requestPayload = {
                params: params,
                userId: this.businessUserId
            };

            this.$store.dispatch('users/GET_ALL_BUSINESS_SUBUSERS', requestPayload)
                .then((data) => {
                    this.businessUsers.push(...data);
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updateUsersList() {
            this.businessUsers = [];
            this.getUsers();
        },
        showWipeOutModal(id) {
            this.wipeOutCardId = id;
            this.wipeOutModalShow = true;
        },
        showRemoveFromBusinessModal(id) {
            this.userIdForRemove = id;
            this.removeUserConfirm = true;
        },
        closeRemoveFromBusinessModal() {
            this.userIdForRemove = null;
            this.removeUserConfirm = false;
        },
        removeUserFromBusiness() {
            let requestPayload = {
                userId: this.userIdForRemove
            };

            this.$store.dispatch('users/REMOVE_USER_FROM_BUSINESS', requestPayload)
                .then((data) => {
                    this.closeRemoveFromBusinessModal();
                    this.updateUsersList();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    created() {
        this.businessUserId = this.$route.query.businessUserId;
        this.getUsers();
    }
}
</script>
