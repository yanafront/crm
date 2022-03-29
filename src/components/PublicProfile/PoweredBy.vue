<template>
    <div class="powered-by column-center s-align-5">
        <a
            class="primary-button pointer"
            :style="{ backgroundColor: `${buttonColor}` }"
            :href="BUSINESS_SITE_DOMAIN"
            target="_blank"
        >
            <template v-if="buttonColor">
                <span class="color-invert">Get your own digital business card</span>
            </template>
            <template v-else>
                Get your own digital business card
            </template>
        </a>
        <p class="mt-30 f-12-grey">Powered by <span class="f-12-black f-bold">Retrēv</span></p>
    </div>
</template>

<script>
import { BUSINESS_SITE_DOMAIN } from '@/constants';
import { mapGetters } from 'vuex';

export default {
    name: "PoweredBy",
    data() {
        return {
            BUSINESS_SITE_DOMAIN
        }
    },
    computed: {
        ...mapGetters({
            publicCardInfo: 'cards/getPublicCard'
        }),
        buttonColor() {
            if (this.publicCardInfo.button_color !== 'null') {
                return this.publicCardInfo?.button_color;
            }
        }
    }
}
</script>
