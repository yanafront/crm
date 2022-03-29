<template>
    <div
        :class="[
            'br-10 ph-6 pt-6 admin-users-table',
            {'b-grey-9' : mScreen}
        ]"
    >
        <div
            v-if="!mScreen"
            class="table-header row-start row-baseline ph-20 pv-7 f-11-black f-medium br-10"
        >
            <div class="lg-1">Status</div>
            <div class="lg-2">Users and companies</div>
            <div class="lg-2">Contact</div>
            <div class="lg-2">Email</div>
            <div class="lg-2">Unique URL</div>
            <div class="lg-1">Fee</div>
            <div class="lg-1">Pro account</div>
            <div class="lg-1">Convert to Admin</div>
        </div>
        <div
            :class="[
                'row-start row-baseline ph-20 pv-20 f-13-black pointer',
                {'bb-grey' : mScreen}
            ]"
            v-for="item in usersList"
            :key="item.id"
            @click="toBusinessUsersList(item)"
        >
            <div
                :class="[
                    'lg-1 sm-6 relative',
                    mScreen ? 'order-negative mb-3' : ''
                ]"
                @click.stop
            >
                <checkbox-button
                    v-if="item.role === USER_ROLES.INDIVIDUAL_PAID
                        || item.role === USER_ROLES.INDIVIDUAL"
                    color="grey"
                    class="mr-2 checkbox-users"
                >
                    <input
                        type="checkbox"
                        v-model="item.selected"
                        @change="selectUser($event, item)"
                    />
                </checkbox-button>
                <span
                    v-if="item.role"
                    :class="[
                        'uppercase f-10-white f-medium ph-2 pv-1 br-5 s-align-5',
                        {'bg-darkblue3': getUserRole(item) === ROLES_NAMING.INDIVIDUAL},
                        {'bg-grey9': getUserRole(item) === ROLES_NAMING.INDIVIDUAL_PAID},
                        {'bg-greyblue': getUserRole(item) === ROLES_NAMING.BUSINESS_PAID},
                        {'bg-maingreen': getUserRole(item) === ROLES_NAMING.ADMIN}
                    ]"
                    @click.stop
                >
                    {{ getUserRole(item) }}
                </span>
                <template v-else>
                    No information
                </template>
            </div>
            <div
                :class="[
                    'lg-2 sm-12 f-13-black f-medium',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <template v-if="item && (item.first_name || item.last_name)">
                    <span
                        v-if="mScreen"
                        class="f-11-black f-medium mr-3"
                    >
                        User:
                    </span>
                    {{ fullName(item) }}
                </template>
                <template v-else>
                    No information
                </template>
                <template v-if="item.company_name && item.company_name !== null">
                    <br /> {{ item.company_name }}
                </template>
            </div>
            <div
                :class="[
                    'lg-2 sm-12',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <template v-if="item.phone">
                    {{ item.phone }}
                </template>
                <template v-else>
                    No information
                </template>
            </div>
            <div
                :class="[
                    'lg-2 sm-12',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <template v-if="item.email">
                    {{ item.email }}
                </template>
                <template v-else>
                    No information
                </template>
            </div>
            <div
                :class="[
                    'lg-2 sm-6 row-baseline',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <span>
                    {{ item.code }}
                </span>
            </div>
            <div
                :class="[
                    'lg-1 sm-6 row-baseline',
                    mScreen ? 'order-negative mb-3 s-align-6' : ''
                ]"
            >
                <span v-if="hasActiveSubscriptions(item)">
                    ${{ item.active_subscriptions[0].cost }}
                </span>
                <span
                    :class="[
                        'f-12-white f-medium br-7 s-align-5 ph-4 pv-1',
                        hasActiveSubscriptions(item) ? 'ml-4 bg-maingreen' : item.is_manual_pro ? 'bg-greyblue' : 'bg-pink'
                    ]"
                >
                    <template v-if="hasActiveSubscriptions(item)">
                        Paid
                    </template>
                    <template v-else-if="item.is_manual_pro">
                        Manually
                    </template>
                     <template v-else>
                        Unpaid
                    </template>
                </span>
            </div>
            <div
                :class="[
                    'lg-1 sm-12 row-baseline',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <span
                    v-if="mScreen"
                    class="f-11-black f-medium mr-3"
                >
                    Pro account
                </span>
                <toggle-switch @click.stop>
                    <input
                        type="checkbox"
                        @change="togglePro(item, $event.target.checked)"
                        :checked="isProAccount(item)"
                    />
                </toggle-switch>
            </div>
            <div
                v-show="showConvertToBusinessAdmin(item)"
                :class="[
                    'lg-1 sm-12 row-baseline',
                    mScreen ? 'mb-3' : ''
                ]"
            >
                <span
                    v-if="mScreen"
                    class="f-11-black f-medium mr-3"
                >
                    Convert to Admin
                </span>
                <toggle-switch
                    @click.stop
                    :class="{'toggle-switch_disabled': disabledConvertToBusinessAdmin(item)}"
                >
                    <input
                        type="checkbox"
                        @change="toggleBusinessAdmin(item, $event)"
                        :checked="isBusinessAdmin(item)"
                        :disabled="disabledConvertToBusinessAdmin(item)"
                    />
                </toggle-switch>
            </div>
        </div>
        <modal
            v-if="confirmDeactivateBusinessAdmin"
            @close="closeDeactivateConfirmModal"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 t-center">
                    Deactivate Business Admin
                </h1>
            </template>
            <template #description>
                <p class="f-13-darkgrey">This will deactivate business admin. Are you sure?</p>
            </template>
            <template #body>
                <div class="row-end">
                    <border-button
                        class="mr-6"
                        @click="closeDeactivateConfirmModal"
                    >
                        No
                    </border-button>
                    <danger-button @click="deactivateBusinessAdmin">
                        Yes
                    </danger-button>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import { USER_ROLES, ROLES_NAMING } from '@/constants';
import { fullName } from '@/helpers/commonHelpers.js';
import { mapGetters } from 'vuex';

export default {
    name: 'UsersTable',
    components: {
        Modal
    },
    props: {
        usersList: {
            type: Array,
            default: []
        },
        selectedRolesFilter: {
            type: Object,
            default: null
        }
    },
    emits: ['selectedUser'],
    data() {
        return {
            USER_ROLES,
            ROLES_NAMING,
            confirmDeactivateBusinessAdmin: false,
            deactivatedUserId: null,
            toggleState: null
        }
    },
    computed: {
        ...mapGetters({
            allSelectedUsers: 'users/getAllSelectedUsers'
        })
    },
    methods: {
        // Methods imported from helpers
        fullName,
        getUserRole(user) {
            switch (user.role) {
                case USER_ROLES.ADMIN:
                    return ROLES_NAMING.ADMIN;
                case USER_ROLES.INDIVIDUAL:
                    return ROLES_NAMING.INDIVIDUAL;
                case USER_ROLES.INDIVIDUAL_PAID:
                    return ROLES_NAMING.INDIVIDUAL_PAID;
                case USER_ROLES.BUSINESS_PAID:
                case USER_ROLES.BUSINESS:
                    return ROLES_NAMING.BUSINESS_PAID;
            }
        },
        isProAccount(user) {
            if (user.role === USER_ROLES.INDIVIDUAL_PAID
                || user.role === USER_ROLES.BUSINESS_PAID
            ) {
                return (!!user.active_subscriptions.length && !user.active_subscriptions[0].on_grace_period) || user.is_manual_pro;
            }

            return false;
        },
        isBusinessAdmin(user) {
            return user.role === USER_ROLES.BUSINESS_PAID || user.role === USER_ROLES.BUSINESS;
        },
        showConvertToBusinessAdmin(user) {
            return user.role !== USER_ROLES.ADMIN;
        },
        disabledConvertToBusinessAdmin(user) {
            return ((user.role === USER_ROLES.INDIVIDUAL || user.role === USER_ROLES.INDIVIDUAL_PAID) && !!user.active_subscriptions.length);
        },
        hasActiveSubscriptions(user) {
            if (user.active_subscriptions.length) {
                return user.active_subscriptions[0]?.cost;
            }
            return false;
        },
        toBusinessUsersList(user) {
            if (user.role === USER_ROLES.BUSINESS_PAID
                || user.role === USER_ROLES.BUSINESS
            ) {
                this.$router.push({
                    name: 'BusinessUsersList',
                    query: {
                        businessUserId: user.id
                    }
                });
            } else {
                this.$router.push({
                    name: 'EditUser',
                    params: {
                        user: user.id
                    }
                });
            }
        },
        selectUser(event, user) {
            let map = new Map();
            let users = JSON.parse(JSON.stringify(this.allSelectedUsers));

            if (event.target.checked) {
                users.push(user.id);
                map.set("add", user);
            } else {
                let userIndex = users.findIndex(el => el.id === user.id);
                map.set("delete", user);
                users.splice(userIndex, 1);
            }

            this.$store.commit('users/SET_SELECTED_USER', users);
            this.$emit('selectedUser', map);
        },
        togglePro(user, isPro) {
            let requestPayload = {
                userId: user.id,
                isPro
            };

            this.$store.dispatch('users/TOGGLE_USER_IS_PRO', requestPayload)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Switch Pro has been activated successfully!`
                    );

                    let userIndex = this.usersList.findIndex(el => el.id === user.id);

                    if (userIndex !== -1) {
                        this.usersList[userIndex].is_manual_pro = isPro ? 1 : 0;
                    }
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        toggleBusinessAdmin(user, event) {
            this.toggleState = event;
            this.deactivatedUserId = user.id;
            let toggleOn = this.toggleState.target.checked;
            this.toggleState.target.checked = !this.toggleState.target.checked;

            let requestPayload = {
                userId: user.id
            };

            if (toggleOn) {
                this.$store.dispatch('users/CONVERT_USER_TO_BUSINESS', requestPayload)
                    .then((data) => {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            'Business admin has been activated successfully!'
                        );

                        this.updateUsersTable(data);
                        this.deactivatedUserId = null;
                        this.toggleState = null;
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            } else {
                this.confirmDeactivateBusinessAdmin = true;
            }
        },
        deactivateBusinessAdmin() {
            let requestPayload = {
                userId: this.deactivatedUserId
            };

            this.$store.dispatch('users/CONVERT_BUSINESS_TO_USER', requestPayload)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        'Business admin has been deactivated successfully!'
                    );

                    this.updateUsersTable(data);
                    this.closeDeactivateConfirmModal();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        updateUsersTable({ role }) {
            let userIndex = this.usersList.findIndex(el => el.id === this.deactivatedUserId);

            if (this.selectedRolesFilter !== null && this.selectedRolesFilter.role) {
                this.usersList.splice(userIndex, 1);
            } else {
                if (userIndex !== -1) {
                    this.usersList[userIndex].role = role;
                    this.toggleState.target.checked = !this.toggleState.target.checked;
                }
            }
        },
        closeDeactivateConfirmModal() {
            this.deactivatedUserId = null;
            this.toggleState = null;
            this.confirmDeactivateBusinessAdmin = false;
        },
        toEditUser(user) {
            this.$router.push({
                name: 'EditUser',
                params: {
                    user
                }
            });
        },
    }
}
</script>
