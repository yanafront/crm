import { SCREEN_SIZES } from '@/constants';

export default {
    computed: {
        actualScreenSize() {
            return this.$store.getters['screen/getScreenSize'];
        },
        mScreen() {
            return this.actualScreenSize == SCREEN_SIZES.MOBILE;
        },
        tScreen() {
            return this.actualScreenSize == SCREEN_SIZES.TABLET;
        },
        nScreen() {
            return this.actualScreenSize == SCREEN_SIZES.NETBOOK;
        },
        dScreen() {
            return this.actualScreenSize == SCREEN_SIZES.DESKTOP;
        }
    }
}
