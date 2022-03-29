<template >
    <div
        class="column-start pro-features br-20 p-20"
        :style="`height: ${loading ? '240px' : 'auto'}`"
    >
        <template v-if="!loading">
            <span
                class="subsriptions-label mb-6 pointer"
                @click="toProductsPage"
            >
                <template v-if="!activeSubscriptionData && !proAccountMaually">
                    Upgrade to Pro
                </template>
                <template v-else>
                    Manage subscription
                </template>
            </span>
            <h2 class="f-18-black f-black">
                <template v-if="activeSubscriptionData">
                    {{ activeSubscriptionData.product_name }}
                </template>
                <template v-else-if="proAccountMaually">
                    Pro Individual
                </template>
                <template v-else>
                    Upgrade to Pro
                </template>
            </h2>
            <p class="f-13-grey mt-3 mb-7">Get the most out of Retrēv!</p>
            <ul class="f-11-darkgrey">
                <li>Advanced analytics</li>
                <li>Share photos, videos, pdf</li>
                <li>Download Contacts (XLSX)</li>
                <li>Page settings, Multiple pages</li>
                <li>Business account</li>
            </ul>
        </template>
        <div
            v-else
            class="pro-features_loader"
        >
            <loader />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ProFeatures',
    data() {
        return {
            loading: true
        }
    },
    emits: ['closeMenu'],
    computed: {
        ...mapGetters({
            activeSubscription: 'user/getActiveSubscription',
            proAccountMaually: 'user/isProAccountMaually'
        }),
        activeSubscriptionData() {
            if (this.activeSubscription && this.activeSubscription.length) {
                return this.activeSubscription[0];
            } else {
                return false;
            }
        }
    },
    methods: {
        toProductsPage() {
            this.$emit('closeMenu');
            this.$router.push({ name: 'Products' });
        }
    },
    created() {
        setTimeout(() => this.loading = false, 1500);
    }
}
</script>
