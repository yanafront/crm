<template>
    <div class="column-start h-100">
        <div
            :class="[
                'mb-40 lg-12',
                userRole === USER_ROLES.ADMIN ? 'column-start' : 'row-start'
            ]"
        >
            <div class="row-start row-baseline mb-8">
                <h1 class="f-28-black f-black">Users</h1>
                <primary-button
                    v-if="allUsersList.length"
                    class="ml-auto sm-12 mt-sm-1"
                    @click="downloadUsers"
                >
                    Download users
                </primary-button>
            </div>
            <permission-checker
                :roles="[
                    USER_ROLES.ADMIN
                ]"
            >
                <div class="lg-12 sm-12 row-end row-baseline">
                    <div
                        :class="[
                            'lg-2 sm-12',
                            mScreen ? 'mb-5' : 's-align-5 pr-8'
                        ]"
                    >
                        <vue-select
                            class="w-100"
                            :options="sortOptions"
                            label-by="id"
                            close-on-select
                            v-model="selectedSortParametr"
                            :empty-model-value="selectedSortParametr"
                            @selected="setSortParametr($event)"
                        >
                            <template #label="{ selected }">
                                <template v-if="selected">
                                    <div>
                                        {{ `${selected.title}` }}
                                    </div>
                                </template>
                                <template v-else>Sort by</template>
                            </template>
                            <template #dropdown-item="{ option }">
                                <div>
                                    {{ `${option.title}` }}
                                </div>
                            </template>
                        </vue-select>
                    </div>
                    <div
                        :class="[
                            'lg-2 sm-12 ',
                            mScreen ? 'mb-5' : 's-align-5 pr-8'
                        ]"
                    >
                        <vue-select
                            class="w-100"
                            :options="usersTypeByRole"
                            label-by="id"
                            close-on-select
                            v-model="selectedUserType"
                            @selected="setSelectedUserType($event)"
                        >
                            <template #label="{ selected }">
                                <template v-if="selected">
                                    <div>
                                        {{ `${selected.title}` }}
                                    </div>
                                </template>
                                <template v-else>Select user role</template>
                            </template>
                            <template #dropdown-item="{ option }">
                                <div>
                                    {{ `${option.title}` }}
                                </div>
                            </template>
                        </vue-select>
                    </div>
                    <primary-button
                        :class="[
                            's-align-5',
                            mScreen ? 'w-100 mb-5 mr-0': 'mr-8'
                        ]"
                        @click="$router.push({ name: 'AddNewUser' })"
                    >
                        <plus-icon class="i-white mr-6"/>
                        Add New User
                    </primary-button>
                    <primary-button
                        :class="[
                            's-align-5',
                            mScreen ? 'w-100 mb-5 mr-0': 'mr-8'
                        ]"
                        @click="$router.push({ name: 'AddNewBusiness' })"
                    >
                        <plus-icon class="i-white mr-6"/>
                        Add New Business Account
                    </primary-button>
                    <primary-button
                        :class="[
                            's-align-5',
                            mScreen ? 'w-100 mb-5 mr-0': 'mr-8'
                        ]"
                        @click="addUsersToBusiness"
                    >
                        <plus-icon class="i-white mr-6"/>
                        Bind with existing business account
                    </primary-button>
                    <search-bar
                        :class="['relative', {'sm-12 mt-3' : mScreen}]"
                        placeholder="Search user"
                        @input="searchUser"
                        @close="closeSearch"
                    />
                </div>
            </permission-checker>
        </div>
        <permission-checker
            :roles="[
                USER_ROLES.ADMIN
            ]"
        >
            <div
                v-if="selectedUsersList.length"
                class="w-100 mb-20"
            >
                <h1 class="f-24-black f-black mb-20">Selected users</h1>
                <dynamic-table
                    :header="selectedUsersTableData.tableHeader"
                    :tableData="selectedUsersList"
                    :optionsForRender="selectedUsersTableData.optionsForRender"
                />
            </div>
            <div
                v-if="!loading"
                class="w-100 h-100 pb-40"
            >
                <div
                    v-if="allUsersList.length"
                    class="w-100"
                >
                    <user-table
                        :usersList="allUsersList"
                        :selectedRolesFilter="selectedUserType"
                        @getUsers="updateUsersList"
                        @selectedUser="showSelectedUsers"
                    />
                    <div class="row-center pv-8">
                        <load-more
                            v-if="isMorePages"
                            :status="loadingStatus"
                            @click="getUsers"
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
            <loader v-else/>
        </permission-checker>
        <permission-checker
            :roles="[
                USER_ROLES.BUSINESS,
                USER_ROLES.BUSINESS_PAID
            ]"
        >
            <div
                v-if="!loading"
                class="w-100 h-100 pb-40"
            >
                <div
                    v-if="businessUsers.length"
                    class="w-100"
                >
                    <dynamic-table
                        :header="tableData.tableHeader"
                        :tableData="businessUsers"
                        :optionsForRender="tableData.optionsForRender"
                    />
                </div>
                <div
                    v-else
                    class="h-100 w-100 s-align-5"
                >
                    <p class="f-18-grey">Your page is empty</p>
                </div>
            </div>
            <loader v-else/>
        </permission-checker>
    </div>
</template>

<script>
import { UserTable, DynamicTable, PermissionChecker } from '@/components';
import { USER_ROLES, ROLES_NAMING } from '@/constants';
import { PlusIcon } from '@/icons';
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';
import { getTemporarilyLink } from '@/helpers/commonHelpers.js';

export default {
    name: 'Users',
    components: {
        UserTable,
        DynamicTable,
        PermissionChecker,
        PlusIcon
    },
    data() {
        return {
            USER_ROLES,
            loading: false,
            loadingStatus: false,
            usersTypeByRole: [
                {
                    id: 1,
                    role: '',
                    title: 'All roles'
                },
                {
                    id: 2,
                    role: USER_ROLES.INDIVIDUAL,
                    title: ROLES_NAMING.INDIVIDUAL
                },
                {
                    id: 3,
                    role: USER_ROLES.INDIVIDUAL_PAID,
                    title: ROLES_NAMING.INDIVIDUAL_PAID
                },
                {
                    id: 4,
                    role: USER_ROLES.BUSINESS_PAID,
                    title: 'Business Paid'
                },
                {
                    id: 5,
                    role: USER_ROLES.BUSINESS,
                    title: 'Business Unpaid'
                },
                {
                    id: 6,
                    role: USER_ROLES.ADMIN,
                    title: ROLES_NAMING.ADMIN
                }
            ],
            sortOptions: [
                {
                    id: 1,
                    sortParametr: 'first_name',
                    title: 'Alphabetically'
                },
                {
                    id: 2,
                    sortParametr: 'created_at',
                    title: 'Newest users'
                },
            ],
            selectedUserType: null,
            selectedSortParametr: {
                id: 1,
                sortParametr: 'first_name',
                title: 'Alphabetically'
            },
            tableData: {
                tableHeader: ['Name', 'Number', 'Email', 'Unique URL'],
                optionsForRender: ['full_name', 'phone', 'email', 'code']
            },
            selectedUsersTableData: {
                tableHeader: ['Users and companies', 'Contact', 'Email', 'Unique URL'],
                optionsForRender: ['full_name', 'phone', 'email', 'code']
            },
            businessUsers: [],
            allUsersList: [],
            totalUsers: 0,
            currentPage: 0,
            lastPage: 0,
            isMorePages: false,
            serchQuery: '',
            selectedUsersList: []
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userId: 'user/getUserId',
            usersIsSelected: 'users/usersIsSelected',
            allSelectedUsers: 'users/getAllSelectedUsers'
        }),
    },
    watch: {
        userId() {
            this.loading = true;
            if (
                (this.userRole === USER_ROLES.BUSINESS_PAID || this.userRole === USER_ROLES.BUSINESS)
                && this.userId
            ) {
                this.getUsers();
            }
        }
    },
    methods: {
        setSelectedUserType() {
            this.loading = true;
            this.$nextTick(() => {
                this.resetPagination();
                this.getUsers();
            });
        },
        setSortParametr() {
            this.loading = true;
            this.$nextTick(() => {
                this.resetPagination();
                this.getUsers();
            });
        },
        getUsers() {
            let params = {
                perPage: 20
            };

            if (this.currentPage > 0) {
                Object.assign(params, { page: this.currentPage + 1 });
            }

            if (this.serchQuery) {
                Object.assign(params, { search: this.serchQuery });
            }

            if (this.selectedUserType?.role) {
                Object.assign(params, { roles: this.selectedUserType.role });
            }

            this.loadingStatus = true;

            let requestPayload = {
                params: params
            };

            let storeModuleName = '';
            switch (this.userRole) {
                case USER_ROLES.BUSINESS_PAID:
                case USER_ROLES.BUSINESS:
                    storeModuleName = 'users/GET_ALL_BUSINESS_SUBUSERS';
                    requestPayload['userId'] = this.userId;
                    break;
                case USER_ROLES.ADMIN:
                    let sortParams = {
                        order: this.selectedSortParametr.sortParametr === 'created_at'
                            ? 'desc' : 'asc',
                    };

                    if (this.selectedSortParametr?.sortParametr) {
                        sortParams.sort = this.selectedSortParametr.sortParametr;
                    }

                    Object.assign(requestPayload.params, sortParams);
                    storeModuleName = 'users/GET_ALL_USERS_BY_SUPERADMIN';
                    break;
            }

            this.$store.dispatch(storeModuleName, requestPayload)
                .then((data) => {
                    if (this.userRole === USER_ROLES.BUSINESS_PAID
                        || this.userRole === USER_ROLES.BUSINESS
                    ) {
                        this.businessUsers.push(...data);
                    } else {
                        this.allUsersList.push(...data.data);
                        this.allUsersList = this.allUsersList.map(el => {
                            return {
                                ...el,
                                selected: this.allSelectedUsers.includes(el.id) ? true : false
                            }
                        });
                        this.totalUsers = data.total;
                        this.currentPage = data.current_page;
                        this.lastPage = data.last_page;
                        data.current_page === data.last_page
                            ? this.isMorePages = false
                            : this.isMorePages = true;
                    }
                    this.loadingStatus = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        searchUser: debounce(function (value) {
            this.resetPagination();
            this.serchQuery = value;
            this.getUsers();
        }, 500),
        resetPagination() {
            this.currentPage = 0;
            this.serchQuery = '';
            this.allUsersList = [];
        },
        closeSearch() {
            if (this.serchQuery) {
                this.loading = true;
                this.resetPagination();
                this.getUsers();
            }
        },
        updateUsersList() {
            this.resetPagination();
            this.getUsers();
        },
        addUsersToBusiness() {
            if (!this.usersIsSelected) {
                this.$store.dispatch(
                    'notifications/SHOW_WARNING_NOTIFICATION',
                    `Select one or more users.`
                );
                return;
            }

            this.$router.push({ name: 'AddUsersToExistingBusiness' });
        },
        downloadUsers() {
            let params = {
                user: this.userId,
                with_sub_users: 1,
                sort: this.selectedSortParametr.sortParametr,
                order: this.selectedSortParametr.sortParametr === 'created_at'
                    ? 'desc' : 'asc'
            };

            if (this.serchQuery) {
                Object.assign(params, { search: this.serchQuery });
            }

            if (this.selectedUserType?.role) {
                Object.assign(params, { roles: this.selectedUserType.role });
            }

            let requestPayload = {
                source: 'users'
            }

            this.$store.dispatch('user/GET_DOWNLOADS_TOKEN', requestPayload)
                .then((data) => {
                    params['downloadToken'] = data.data;
                    let query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                    let link = `${process.env.VUE_APP_URL}/api/downloads/users?${query}`;
                    getTemporarilyLink(link);
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Users list has been downloaded.`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        showSelectedUsers(val) {
            if (val.has('add')) {
                this.selectedUsersList.push(val.get('add'));
            }

            if (val.has('delete')) {
                let index = this.selectedUsersList.findIndex(el => {
                    return el.id === val.get('delete').id;
                });
                this.selectedUsersList.splice(index, 1);
            }
        }
    },
    created() {
        this.loading = true;
        if (
            (this.userRole === USER_ROLES.BUSINESS_PAID || this.userRole === USER_ROLES.BUSINESS)
            && this.userId
        ) {
           this.getUsers();
        }

        if (this.userRole === USER_ROLES.ADMIN) {
           this.getUsers();
        }
    },
    beforeRouteLeave: function(to, from, next) {
        if (to.name !== 'AddNewBusiness'
            && to.name !== 'AddUsersToExistingBusiness') {
            this.$store.commit('users/SET_SELECTED_USER', []);
        }
        next();
    }
}
</script>
