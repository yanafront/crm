import {
    SHOW_VALIDATION_ERROR_NOTIFICATION,
    SHOW_REQUEST_ERROR_NOTIFICATION,
    SHOW_SUCCESS_NOTIFICATION,
    SHOW_ERROR_NOTIFICATION,
    SHOW_WARNING_NOTIFICATION
} from '../actions/notifications';
import { useToast } from 'vue-toastification';

const toast = useToast();

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        [SHOW_VALIDATION_ERROR_NOTIFICATION]({}, errors) {
            if (Object.keys(errors).length) {
                Object.keys(errors).forEach(error => {
                    toast.error(errors[error]);
                });
            }
        },
        [SHOW_REQUEST_ERROR_NOTIFICATION]({}, error) {
            if (error.response.data
                && error.response.data.meta.code == 422
                && Object.keys(error.response.data.meta.error_description).length
            ) {
                Object.keys(error.response.data.meta.error_description).forEach(key => {
                    error.response.data.meta.error_description[key].forEach((item, index) => {
                        toast.error(error.response.data.meta.error_description[key][index]);
                    });
                });
            } else if (error.response.data.meta.error_description) {
                toast.error(error.response.data.meta.error_description);
            } else {
                toast.error(error.response.data.meta.error_message);
            }
        },
        [SHOW_SUCCESS_NOTIFICATION]({}, message) {
            toast.success(message);
        },
        [SHOW_ERROR_NOTIFICATION]({}, message) {
            toast.error(message);
        },
        [SHOW_WARNING_NOTIFICATION]({}, message) {
            toast.warning(message);
        }
    }
}
