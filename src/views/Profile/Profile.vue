<template>
    <div v-if="!loading">
        <div class="column-start mb-25">
            <p class="f-15-grey mb-2">Your Page</p>
            <div class="row-between row-baseline">
                <div class="lg-6 sm-12">
                    <p
                        v-if="fullName"
                        class="f-28-black f-black row-baseline"
                    >
                        {{ fullName }}
                        <permission-checker
                            :roles="[
                                USER_ROLES.INDIVIDUAL_PAID,
                                USER_ROLES.BUSINESS_PAID,
                                USER_ROLES.ADMIN
                            ]"
                        >
                            <star-icon
                                class="ml-4 i-yellow"
                            />
                        </permission-checker>
                    </p>
                </div>
                <permission-checker
                    :roles="[
                        USER_ROLES.INDIVIDUAL_PAID,
                        USER_ROLES.BUSINESS_PAID,
                        USER_ROLES.ADMIN
                    ]"
                >
                    <div
                        :class="[
                            'lg-2 sm-12',
                            {'mt-1': mScreen}
                        ]"
                    >
                        <profle-cards-switcher />
                    </div>
                </permission-checker>
            </div>
        </div>
        <div class="column-start">
            <profile-card
                v-if="Object.keys(cardInfo).length"
                :cardInfo="cardInfo"
                :key="cardId"
            />
        </div>
    </div>
    <loader v-else />
</template>

<script>
import { ProfileCard, PermissionChecker, ProfleCardsSwitcher } from '@/components';
import { ShareIcon, StarIcon } from '@/icons';
import { USER_ROLES } from '@/constants';
import { mapGetters } from 'vuex';

export default {
    name: 'Profile',
    components: {
        ProfileCard,
        PermissionChecker,
        ProfleCardsSwitcher,
        ShareIcon,
        StarIcon
    },
    data() {
        return {
            USER_ROLES,
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            cardInfo: 'cards/getUserCard',
            cardId: 'user/getCardId'
        }),
        fullName() {
            let fullName = '';
            if (this.cardInfo && Object.keys(this.cardInfo).length) {
                fullName = this.cardInfo?.first_name || '';
                fullName += this.cardInfo?.last_name ? ` ${this.cardInfo?.last_name}` : '';
            }

            return fullName;
        },
    },
    methods: {
        getCardsByAuthUser() {
            this.loading = true;
            this.$store.dispatch('cards/GET_CARDS_BY_AUTH_USER')
                .then((data) => {})
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        }
    },
    created() {
        if (!this.cardInfo || !Object.keys(this.cardInfo).length) {
            this.getCardsByAuthUser();
        }
    }
}
</script>
