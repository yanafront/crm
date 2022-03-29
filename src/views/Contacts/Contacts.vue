<template>
    <div
        class="column-start h-100"
        v-if="!loading"
    >
        <div class="row-between row-baseline mb-40">
            <div class="column-start lg-6 sm-12">
                <h1 class="f-28-black f-black">Contacts</h1>
                <p class="f-18-grey f-medium mt-4">Contact details of people who have shared their contacts with you.</p>
            </div>
            <div class="lg-6 sm-12 row-end row-baseline">
                <permission-checker
                    :roles="[
                        USER_ROLES.ADMIN,
                        USER_ROLES.BUSINESS_PAID
                    ]"
                >
                    <div class="lg-3 pr-6 sm-12 pr-sm-0 mt-sm-1">
                        <vue-select
                            class="w-100"
                            :options="filterOptions"
                            label-by="id"
                            close-on-select
                            v-model="selectedFilterParametr"
                            :empty-model-value="selectedFilterParametr"
                            @selected="setFilterParametr($event)"
                        >
                            <template #label="{ selected }">
                                <template v-if="selected">
                                    <div>
                                        {{ `${selected.title}` }}
                                    </div>
                                </template>
                                <template v-else>Filter by</template>
                            </template>
                            <template #dropdown-item="{ option }">
                                <div>
                                    {{ `${option.title}` }}
                                </div>
                            </template>
                        </vue-select>
                    </div>
                </permission-checker>
                <permission-checker
                    :roles="[
                        USER_ROLES.ADMIN,
                        USER_ROLES.INDIVIDUAL_PAID,
                        USER_ROLES.BUSINESS,
                        USER_ROLES.BUSINESS_PAID
                    ]"
                >
                    <primary-button
                        v-if="contactsList.length"
                        class="s-align-6 sm-12 mt-sm-1"
                        @click="downloadContacts"
                    >
                        Download contacts
                    </primary-button>
                </permission-checker>
            </div>
        </div>
        <div
            v-if="contactsList.length"
            class="w-100 h-100"
        >
            <dynamic-table
                :header="tableHeader"
                :tableData="contactsList"
                :optionsForRender="optionsForRender"
                @removeContactfromTable="showDeleteConfirmModal"
            />
            <div class="row-center pv-8">
                <load-more
                    v-if="isMorePages"
                    :status="loadingStatus"
                    @click="getContactsList"
                />
            </div>
        </div>
        <div
            v-else
            class="h-100 w-100 s-align-5"
        >
            <p class="f-18-grey">Your page is empty</p>
        </div>
    </div>
    <loader v-else />
    <modal
        v-if="confirmDeleteContact"
        @close="closeDeleteConfirmModal"
    >
        <template #title>
            <h1 class="f-20-black f-bold mb-2 t-center">
                Deleting contact
            </h1>
        </template>
        <template #description>
            <p class="f-13-darkgrey">Are you sure you want to delete this contact?</p>
        </template>
        <template #body>
            <div class="row-end">
                <border-button
                    class="mr-6"
                    @click="closeDeleteConfirmModal"
                >
                    Cancel
                </border-button>
                <danger-button @click="deleteContact">
                    Delete
                </danger-button>
            </div>
        </template>
    </modal>
</template>

<script>
import { DynamicTable, PermissionChecker } from '@/components';
import { USER_ROLES } from '@/constants';
import Modal from '@/ui/modal/Modal.vue';
import { mapGetters } from 'vuex';
import { getTemporarilyLink } from '@/helpers/commonHelpers.js';

const FILTER_OPTIONS_FOR_SUPER_ADMIN = [
    {
        id: 0,
        title: 'My contacts',
        filterParameter: 'onlyOwn'
    },
    {
        id: 1,
        title: 'All contacts',
        filterParameter: ''
    }
];

export default {
    name: "Contacts",
    components: {
        DynamicTable,
        PermissionChecker,
        Modal
    },
    data() {
        return {
            USER_ROLES,
            loading: false,
            loadingStatus: false,
            tableHeader: ['Name', 'Number', 'Email', 'Company', 'Card Code'],
            optionsForRender: ['name', 'phone', 'email', 'company_name', 'code'],
            contacts: [],
            totalContacts: null,
            isMorePages: false,
            pageNumber: 1,
            confirmDeleteContact: false,
            deletingContactId: null,
            filterOptions: FILTER_OPTIONS_FOR_SUPER_ADMIN,
            selectedFilterParametr: FILTER_OPTIONS_FOR_SUPER_ADMIN[0]
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userId: 'user/getUserId',
        }),
        contactsList() {
            if (this.contacts.length) {
                return this.contacts;
            } else {
                return [];
            }
        }
    },
    methods: {
        setFilterParametr() {
            this.loading = true;
            this.$nextTick(() => {
                this.resetPagination();
                this.getContactsList();
            });
        },
        resetPagination() {
            this.pageNumber = 1;
            this.isMorePages = false;
            this.contacts = [];
        },
        getContactsList() {
            let params = {
                perPage: 20
            };

            if (this.pageNumber > 1) {
                Object.assign(params, { page: this.pageNumber });
            }

            if ((this.userRole === USER_ROLES.ADMIN
                || this.userRole === USER_ROLES.BUSINESS_PAID)
                && this.selectedFilterParametr.filterParameter
            ) {
                Object.assign(params, { onlyOwn: 1 });
            }

            this.pageNumber++;
            this.loadingStatus = true;
            this.$store.dispatch('contacts/GET_ALL_CONTACTS', params)
                .then((data) => {
                    this.contacts.push(...data.data.data);
                    this.totalContacts = data.data.total;
                    data.data.current_page === data.data.last_page
                        ? this.isMorePages = false
                        : this.isMorePages = true;
                    this.loadingStatus = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        removeContactfromTable(contactId) {
            const deletedContactIndex = this.contacts.findIndex(el => el.id === contactId);

            if (deletedContactIndex !== -1) {
                this.contacts.splice(deletedContactIndex, 1);

                if (!this.contactsList.length) {
                    this.loading = true;
                    this.pageNumber = 1;
                    this.getContactsList();
                }
            }
        },
        deleteContact() {
            this.$store.dispatch('contacts/DELETE_CONTACT', this.deletingContactId)
                .then((data) => {
                    this.removeContactfromTable(this.deletingContactId);
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your contact has been deleted!`
                    );
                    this.closeDeleteConfirmModal();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        showDeleteConfirmModal(val) {
            this.confirmDeleteContact = true;
            this.deletingContactId = val;
        },
        closeDeleteConfirmModal() {
            this.confirmDeleteContact = false;
            this.deletingContactId = null;
        },
        downloadContacts() {
            let params = {
                onlyOwn: this.selectedFilterParametr?.filterParameter ? 1 : 0,
                user: this.userId
            };

            let requestPayload = {
                source: 'contacts'
            }

            this.$store.dispatch('user/GET_DOWNLOADS_TOKEN', requestPayload)
                .then((data) => {
                    params['downloadToken'] = data.data;
                    let query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                    let link = `${process.env.VUE_APP_URL}/api/downloads/contacts?${query}`;
                    getTemporarilyLink(link);
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your contacts have been downloaded.`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    created() {
        this.loading = true;
        this.getContactsList();
    }
}
</script>
