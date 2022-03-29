import { createStore } from 'vuex';
import auth from './modules/auth';
import notifications from './modules/notifications';
import cards from './modules/cards';
import screen from './modules/screen';
import contacts from './modules/contacts';
import analytics from './modules/analytics';
import stripe from './modules/stripe';
import user from './modules/user';
import content from './modules/content';
import users from './modules/users';
import tags from './modules/tags';

export default createStore({
    state: {
        host: ''
    },
    getters: {
        getHostName: state => state.host
    },
    mutations: {
        setHostName(state, payload) {
            state.host = payload;
        }
    },
    actions: {
    },
    modules: {
        auth,
        notifications,
        cards,
        screen,
        contacts,
        analytics,
        stripe,
        user,
        content,
        users,
        tags
    }
})
