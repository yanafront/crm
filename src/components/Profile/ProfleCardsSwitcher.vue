<template>
    <div
        class="row-baseline s-align-6 pointer f-15-black relative"
        @click="showCards = !showCards"
    >
        <span class="mr-2 ">Switch to other page</span>
        <arrow-shewron
            :transform="showCards ? '-90' : '90'"
            width="14"
            height="14"
            class="i-black mt-1"
        />
        <div
            v-if="showCards"
            @click.stop
            class="card-switch br-20 p-7 column-start"
            ref="cards"
            :style="{ bottom: `-${heightSwith}px` }"
        >
            <div
                :class="[
                    'card-switch_item br-10 row-baseline flex-no-wrap',
                    {'card-switch_item-decor': index !== cards.length - 1}
                ]"
                v-for="(card, index) in cards"
                :key="card.card_id"
                @click="toEditCard(card)"
            >
                <div>
                    <div
                        v-if="!card.image"
                        class="card-switch_item-photo card-switch_item-photo-empty"
                    ></div>
                    <img
                        v-else
                        class="card-switch_item-photo"
                        :src="card.image"
                        alt="">
                </div>
                <div>
                    <p class="f-14-black f-black row-baseline">
                        {{`${ card.first_name } ${ card.last_name }`}}
                        <span @click.stop="setCardAsPrimary(card)">
                            <star-icon
                                :class="[
                                    'ml-2',
                                    card.is_primary ? 'i-yellow' : 'i-grey'
                                ]"
                            />
                        </span>
                    </p>
                    <p class="f-12-grey f-medium">{{`${ card.first_name }`}}</p>
                </div>
                <div
                    v-if="card.is_primary"
                    class="ml-auto"
                >
                    <span class="mark-round">&#10004;</span>
                </div>
            </div>
            <button
                v-if="cards.length < 3"
                class="card-switch_button f-sbold f-14-green"
                @click="toCreateNewCard"
            >
                Create New Card
            </button>
        </div>
    </div>
</template>

<script>
import { ArrowShewron, StarIcon } from '@/icons';
import { mapGetters } from 'vuex';

const CREATE_MODE = 'create-new';
const EDIT_MODE = 'edit';

export default {
    name: 'ProfleCardsSwitcher',
    components: {
        ArrowShewron,
        StarIcon
    },
    data() {
        return {
            showCards: false,
            heightSwith: 144
        }
    },
    computed: {
        ...mapGetters({
            cards: 'cards/getAllCards'
        })
    },
    methods: {
        toCreateNewCard() {
            this.$router.push({
                name: 'EditProfile',
                query: { mode: CREATE_MODE }
            });
        },
        toEditCard({ card_id: cardId }) {
            this.$router.push({
                name: 'EditProfile',
                query: {
                    mode: EDIT_MODE,
                    card_id: cardId
                }
            });
        },
        setCardAsPrimary({ card_id: cardId }) {
            this.$store.dispatch('cards/SET_CARD_AS_PRIMARY', cardId)
                .then((data) => {
                    this.$store.commit('user/SET_PRIMARY_CARD_ID', cardId);
                    this.showCards = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    updated() {
        if (this.$refs.cards) {
            this.heightSwith = this.$refs.cards.clientHeight + 10;
        }
    }
}
</script>
