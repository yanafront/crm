<template>
    <div class="table-container">
        <div class="table w-100">
            <div class="table-header">
                <div
                    v-for="(title, index) in header"
                    :key="index"
                    :style="{ width: tableCellWidth(title) }"
                    class="ph-2"
                >
                    {{ title }}
                </div>
            </div>
            <div
                :class="[
                    'table-body',
                    {'pointer': isBusinessUsersList}
                ]"
                v-for="item in tableData"
                :key="item.id"
                @click="toEditEntity(item)"
            >
                <template
                    v-for="(option, index) in optionsForRender"
                    :key="index"
                >
                    <div
                        v-if="!isHyperlinkTag(option, item[option])"
                        :style="{ width: tableCellWidth(option) }"
                        class="ph-2 break-word"
                    >
                        <template v-if="option === 'created_at'">
                            at {{ timeFormatting(item[option]) }}
                        </template>
                        <template v-else-if="option === 'wipe_out_button'">
                            <button
                                class="transparent-button b-grey-9 br-7 ph-4 pv-3 f-13-grey"
                                @click.stop="wipeOut(item.card_id)"
                            >
                                Wipe out
                            </button>
                        </template>
                        <template v-else-if="option === 'remove'">
                            <button
                                v-if="item.role !== USER_ROLES.BUSINESS_PAID
                                    && item.role !== USER_ROLES.BUSINESS"
                                class="transparent-button b-grey-9 br-7 ph-4 pv-3 f-13-grey"
                                @click.stop="removeFromBusiness(item.id)"
                            >
                                Remove
                            </button>
                        </template>
                        <template v-else-if="option === 'entity'">
                            {{ item[option].url }}
                        </template>
                        <template v-else-if="option === 'full_name'">
                            {{ fullName(item) }}
                        </template>
                        <template v-else-if="option === 'cardCode' && item['card']">
                            {{ item['card']['code'] }}
                        </template>
                        <template v-else-if="option === 'cardOwner' && item['card']">
                            {{ fullName(item.card) }}
                        </template>
                        <template v-else-if="item[option]">
                            {{ item[option] }}
                        </template>
                        <template v-else>
                            No information
                        </template>
                    </div>
                    <a
                        v-else
                        :style="{ width: tableCellWidth(option) }"
                        class="ph-2 break-word"
                        :href="link(option, item[option])"
                        target="_blank"
                    >
                        <template v-if="item[option]">
                            {{ item[option] }}
                        </template>
                        <template v-else>
                            No information
                        </template>
                    </a>
                </template>
                <button
                    v-if="showDeleteContactBtn"
                    class="transparent-button"
                    @click="initDeleteContact(item.id)"
                >
                    <close-icon size="10"/>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { CloseIcon } from '@/icons';
import { USER_ROLES } from '@/constants';
import { fullName } from '@/helpers/commonHelpers.js';
import moment from 'moment';
import { mapGetters } from 'vuex';

const EMAIL = 'email';
const EMAIL_HEADER = 'Email';
const PHONE = 'phone';

export default {
    name: "DynamicTable",
    components: {
        CloseIcon
    },
    props: {
        header: {
            type: Array,
            required: true
        },
        tableData: {
            type: Array,
            required: true
        },
        optionsForRender: {
            type: Array,
            required: true
        }
    },
    emits: ['removeContactfromTable', 'showWipeOutModal', 'showRemoveFromBusinessModal'],
    data() {
        return {
            USER_ROLES
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
        }),
        tableCellCount() {
            return this.header.length;
        },
        clickedPhoneAndEmail() {
            return this.$route.name === 'Contacts'
                || this.$route.name === 'Users';
        },
        showDeleteContactBtn() {
            return this.$route.name === 'Contacts';
        },
        canDeleteContact() {
            return this.userRole === USER_ROLES.ADMIN
                || this.userRole === USER_ROLES.INDIVIDUAL_PAID
                || this.userRole === USER_ROLES.BUSINESS_PAID;
        },
        isBusinessUsersList() {
            return this.$route.name === 'BusinessUsersList';
        }
    },
    methods: {
        // Methods imported from helpers
        fullName,
        tableCellWidth(option = null) {
            if (this.dScreen) {
                return `calc(100%/${this.tableCellCount})`;
            }

            if (this.mScreen && option === EMAIL || option === EMAIL_HEADER) {
                return '300px';
            }

            return '200px';
        },
        timeFormatting(val) {
            return moment(val).format('hh:mm a M/D/Y');
        },
        isHyperlinkTag(option, val) {
            return val && this.clickedPhoneAndEmail && (option === EMAIL || option === PHONE);
        },
        link(option, link) {
            if (this.clickedPhoneAndEmail && option === EMAIL) {
                return `mailto:${link}`;
            }

            if (this.clickedPhoneAndEmail && option === PHONE) {
                return `tel:${link}`;
            }

            return '';
        },
        initDeleteContact(contactId) {
            if (!this.canDeleteContact) {
                this.$store.dispatch(
                    'notifications/SHOW_WARNING_NOTIFICATION',
                    `Upgrade to Pro to delete Contact info!`
                );
                return;
            }

            this.$emit('removeContactfromTable', contactId);
        },
        wipeOut(cardId) {
            this.$emit('showWipeOutModal', cardId);
        },
        removeFromBusiness(userId) {
            this.$emit('showRemoveFromBusinessModal', userId);
        },
        toEditEntity(item) {
            if (!this.isBusinessUsersList) {
                return;
            }

            if (this.isBusinessUsersList) {
                this.$router.push({
                    name: 'EditUser',
                    params: {
                        user: item.id,
                        user_role: item.role
                    }
                });
                localStorage.setItem('editedUserole', item.role);
            }
        }
    },
}
</script>
