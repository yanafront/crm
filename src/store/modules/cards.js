import {
    GET_CARDS_BY_AUTH_USER,
    GET_CARDS_BY_UNIQUE_LINK,
    GET_CARDS_BY_USER_ID,
    UPDATE_CARD,
    UPDATE_CARD_WITH_FORMDATA,
    SET_CARD_INFO,
    SET_PUBLIC_CARD_INFO,
    REMOVE_CARD_INFO,
    REMOVE_PUBLIC_CARD_INFO,
    RESET_COLOR_THEME,
    SET_COLOR_THEME,
    CREATE_NEW_CARD,
    ADD_NEW_CARD_TO_STORE,
    UPDATE_SINGLE_CARD,
    SET_CARD_AS_PRIMARY,
    MARK_CARD_AS_PRIMARY,
    DELETE_NOT_PRIMARY_CARD,
    REMOVE_CARD_FROM_STORE
} from '../actions/cards';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        cards: [],
        publicCard: {}
    },
    getters: {
        getAllCards: state => state.cards,
        getUserCard: state => {
            if (!state.cards.length) {
                return {};
            }

            const primaryCard = state.cards.find(el => el.is_primary);
            if (primaryCard) {
                return primaryCard;
            } else {
                return state.cards[0];
            }
        },
        getCardByCardId: (state) => (cardId) => {
            if (state.cards.length) {
                return state.cards.find(card => card.card_id == cardId);
            }
        },
        darkModeIsActive: state => {
            if (state.cards.length) {
                const primaryCard = state.cards.find(el => el.is_primary);

                if (primaryCard) {
                    return !!primaryCard.is_dark_mode;
                }

                return false;
            }

            if (Object.keys(state.publicCard).length) {
                return !!state.publicCard?.is_dark_mode;
            }

            return JSON.parse(localStorage.getItem('darkMode'));
        },
        getPublicCard: state => state.publicCard,
        publicProfileIsDark: state => {
            return !!state.publicCard?.is_dark_mode;
        },
        userRoleInPublicProfile: state => state.publicCard?.user_role
    },
    mutations: {
        [SET_CARD_INFO] (state, payload) {
            state.cards = payload;
        },
        [SET_PUBLIC_CARD_INFO] (state, payload) {
            state.publicCard = payload;
        },
        [REMOVE_CARD_INFO] (state, payload) {
            state.cards = payload;
        },
        [REMOVE_PUBLIC_CARD_INFO] (state, payload) {
            state.publicCard = payload;
        },
        [RESET_COLOR_THEME] (state, payload) {
            if (state.cards.length) {
                let updatedCardIndex = state.cards.findIndex(el => el.is_primary);

                if (updatedCardIndex !== -1) {
                    state.cards[updatedCardIndex].is_dark_mode = payload;
                }
            }
        },
        [SET_COLOR_THEME] (state) {
            if (state.cards.length) {
                const primaryCard = state.cards.find(el => el.is_primary);

                if (primaryCard) {
                    localStorage.setItem('darkMode', !!primaryCard.is_dark_mode);
                }
            }
        },
        [MARK_CARD_AS_PRIMARY] (state, payload) {
            state.cards.forEach(el => el.is_primary = 0);
            state.cards.find(el => el.card_id === payload).is_primary = 1;
        },
        [UPDATE_SINGLE_CARD] (state, payload) {
            let updatedCardIndex = state.cards.findIndex(el => el.card_id === payload.card_id);

            if (updatedCardIndex !== -1) {
                state.cards[updatedCardIndex] = payload;
            }
        },
        [ADD_NEW_CARD_TO_STORE] (state, payload) {
            state.cards.push(payload);
        },
        [REMOVE_CARD_FROM_STORE] (state, payload) {
            if (state.cards.length) {
                let cardIndex = state.cards.findIndex(el => el.card_id === payload);

                if (cardIndex !== -1) {
                    state.cards.splice(cardIndex, 1);
                }
            }
        }
    },
    actions: {
        [GET_CARDS_BY_AUTH_USER]({ commit }) {
            return new Promise((resolve, reject) => {
                api.get('/api/cards/user')
                    .then(response => response.data)
                    .then(data => {
                        commit(SET_CARD_INFO, data.data);
                        commit(SET_COLOR_THEME);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_CARDS_BY_USER_ID]({ commit }, userId) {
            return new Promise((resolve, reject) => {
                api.get(`/api/cards/get-by-user/${userId}`)
                    .then(response => response.data)
                    .then(data => {
                        commit(SET_CARD_INFO, data.data);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_CARDS_BY_UNIQUE_LINK]({ commit }, uniqueLink) {
            return new Promise((resolve, reject) => {
                api.get(`/api/cards/get-by-code${uniqueLink}`)
                    .then(response => response.data.data)
                    .then(data => {
                        commit(SET_PUBLIC_CARD_INFO, data);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [UPDATE_CARD]({ commit }, { params, cardId }) {
            return new Promise((resolve, reject) => {
                api.put(`/api/cards/${cardId}`, params)
                    .then(response => response.data)
                    .then(data => {
                        commit(UPDATE_SINGLE_CARD, data.data);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [UPDATE_CARD_WITH_FORMDATA]({ commit }, { cardId, params }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards/${cardId}`, params)
                    .then(response => response.data)
                    .then(data => {
                        commit(UPDATE_SINGLE_CARD, data.data);
                        localStorage.setItem('darkMode', !!data.data.is_dark_mode);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CREATE_NEW_CARD]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards`, params)
                    .then(response => response.data)
                    .then(data => {
                        commit(ADD_NEW_CARD_TO_STORE, data.data);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [SET_CARD_AS_PRIMARY]({ commit }, cardId) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards/${cardId}/set-as-primary`)
                    .then(response => response.data)
                    .then(data => {
                        commit(MARK_CARD_AS_PRIMARY, cardId);
                        commit(SET_COLOR_THEME);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [DELETE_NOT_PRIMARY_CARD]({ commit }, cardId) {
            return new Promise((resolve, reject) => {
                api.delete(`/api/cards/${cardId}`)
                    .then(response => response.data)
                    .then(data => {
                        commit(REMOVE_CARD_FROM_STORE, cardId);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        }
    }
}
