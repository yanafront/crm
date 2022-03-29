import { SCREEN_SIZE } from '../actions/screen';
import { SCREEN_SIZES } from '@/constants';

export default {
    namespaced: true,
    state: {
        screenSize: '',
        inPixels: 0,
    },
    getters: {
        getScreenSize: state => state.screenSize
    },
    mutations: {
        [SCREEN_SIZE] (state, payload) {
            state.inPixels = payload;

            if (payload <= 319) {
                state.screenSize = SCREEN_SIZES.NOT_SUPPORT
            } else if (payload <= 767) {
                state.screenSize = SCREEN_SIZES.MOBILE
            } else if (payload > 767 && payload <= 900) {
                state.screenSize = SCREEN_SIZES.TABLET
            } else if (payload > 900 && payload <= 1165) {
                state.screenSize = SCREEN_SIZES.NETBOOK
            } else {
                state.screenSize = SCREEN_SIZES.DESKTOP
            }
        }
    }
}
