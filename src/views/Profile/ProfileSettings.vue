<template>
    <div
        v-if="!loading"
        class="h-100 column-start"
    >
        <div class="column-start">
            <h1 class="f-28-black f-black">Page Settings</h1>
            <p class="f-18-grey f-medium mt-4">Here you can design your Public Profile page</p>
        </div>
        <div class="row-start pv-40">
            <div class="lg-3 nb-4 md-12 mb-md-2 sm-12 mb-sm-1 column-start">
                <h2 class="f-20-black f-black">Information</h2>
                <p class="f-14-grey f-medium mt-20">You can add your company logo <br /> or set company colors</p>
            </div>
            <div class="lg-9 sm-12 column-start row-start">
                <div class="pb-20 bb-grey lg-10 sm-12">
                    <div class="row-between row-baseline">
                        <div :class="{'w-80': mScreen}">
                            <p class="f-14-black f-black">Dark mode</p>
                            <p class="f-14-grey f-medium mt-1">The switch will activate Dark Mode in the whole app (including Public Profile)</p>
                        </div>
                        <div class="s-align-9">
                            <toggle-switch>
                                <input
                                    type="checkbox"
                                    v-model="darkMode"
                                />
                            </toggle-switch>
                        </div>
                    </div>
                </div>
                <div class="pv-20 bb-grey lg-10 sm-12">
                    <div class="row-between row-baseline">
                        <div :class="{'w-80': mScreen}">
                            <p class="f-14-black f-black">Hide ‘powered by’</p>
                            <p class="f-14-grey f-medium mt-1">The switch will remove “Powered by Retrev” from Public Profile</p>
                        </div>
                        <div class="s-align-9">
                            <toggle-switch>
                                <input
                                    type="checkbox"
                                    v-model="hidePowereBy"
                                />
                            </toggle-switch>
                        </div>
                    </div>
                </div>
                <div class="pv-20 bb-grey lg-10 sm-12">
                    <div class="row-between row-baseline">
                        <div>
                            <p class="f-14-black f-black">Button color</p>
                            <p class="f-14-grey f-medium mt-1 row-baseline">
                                <template v-if="buttonColor">
                                    Your current button color is
                                </template>
                                <template v-else>
                                    Choose button color
                                </template>
                                <span
                                    v-if="buttonColor"
                                    class="color-preview mt-1 ml-3"
                                    :style="{ backgroundColor: `${buttonColor}` }"
                                ></span>
                            </p>
                        </div>
                        <div
                            :class="[
                                'sm-12',
                                mScreen ? 'mt-3 s-align-1' : 's-align-9'
                            ]"
                        >
                            <primary-button
                                @click="changeColor(buttonColor, 'buttonColor')"
                            >
                                Choose a color
                            </primary-button>
                        </div>
                    </div>
                </div>
                <div class="pv-20 bb-grey lg-10 sm-12">
                    <div class="row-between row-baseline">
                        <div>
                            <p class="f-14-black f-black">Background color</p>
                            <p class="f-14-grey f-medium mt-1 row-baseline">
                                <template v-if="backgroundColor">
                                    Your current card background color is
                                </template>
                                <template v-else>
                                    Choose background color
                                </template>
                                <span
                                    v-if="backgroundColor"
                                    class="color-preview mt-1 ml-3"
                                    :style="{ backgroundColor: `${backgroundColor}` }"
                                ></span>
                            </p>
                        </div>
                        <div
                            :class="[
                                'sm-12',
                                mScreen ? 'mt-3 s-align-1' : 's-align-9'
                            ]"
                        >
                            <primary-button
                                @click="changeColor(backgroundColor, 'backgroundColor')"
                            >
                                Choose a color
                            </primary-button>
                        </div>
                    </div>
                </div>
                <div class="bb-grey pv-20 lg-10 sm-12">
                    <div class="row-between row-baseline">
                        <div>
                            <p class="f-14-black f-black">Add cover picture</p>
                            <p class="f-14-grey f-medium mt-1">This photo will be shown on your Public Profile</p>
                        </div>
                        <div
                            :class="[
                                'sm-12',
                                mScreen ? 'mt-3 s-align-1' : 's-align-9'
                            ]"
                        >
                            <primary-button
                                @click="openCoverImageModal"
                            >
                                Add cover picture
                            </primary-button>
                            <danger-button
                                v-if="coverImagePreview"
                                @click="isFreeUser ? redirectToPlans() : deleteCoverImage()"
                                class="ml-2"
                            >
                                Delete
                            </danger-button>
                        </div>
                    </div>
                </div>
                <div
                    v-if="coverImagePreview"
                    class="bb-grey pv-20 lg-10 sm-12"
                >
                    <div class="row-start">
                        <div class="cover-photo-preview">
                            <img :src="coverImagePreview"/>
                        </div>
                    </div>
                </div>
                <div class="pv-20 lg-10 sm-12">
                    <div class="row-end row-baseline">
                        <primary-button
                            @click="isFreeUser ? redirectToPlans() : resetConfirmMoadal = true"
                            :class="[mScreen ? 'w-100 mb-2' : 'ml-2']"
                        >
                            Reset settings
                        </primary-button>
                    </div>
                </div>
            </div>
            <color-picker-component
                v-if="showColorPicker"
                :colorForChange="colorForChange"
                @closeColorPicker="saveColorAndClose"
                @close="showColorPicker = false"
            />
            <add-cover-photo-modal
                id="coverModal"
                v-if="showCoverPictureModal"
                @addCoverPhoto="showPreview"
                @close="closeCoverImageModal"
            />
        </div>
        <div class="page-button-panel w-100">
            <primary-button
                class="mr-5"
                @click="isFreeUser ? redirectToPlans() : saveSettings()"
            >
                Save and View
            </primary-button>
            <border-button
                @click="cancel"
            >
                Cancel
            </border-button>
        </div>
        <modal
            v-if="showConfirmMoadal"
            @close="showConfirmMoadal = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 w-90 t-center pl-50">
                    Your settings have not been saved
                </h1>
            </template>
            <template #body>
                <p class="f-13-darkgrey t-center s-align-5 w-100">
                    Are you sure you want to leave this page?<br />
                    Please press “Save Settings” button first.
                </p>
                <div class="row-center mt-40">
                    <primary-button
                        @click="changeNotSaved = false, showConfirmMoadal = false"
                    >
                        Ok
                    </primary-button>
                </div>
            </template>
        </modal>
        <modal
            v-if="resetConfirmMoadal"
            @close="resetConfirmMoadal = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 w-90 t-center pl-50">
                    Reset Settings
                </h1>
            </template>
            <template #body>
                <p class="f-13-darkgrey t-center s-align-5 w-100">
                    This action will reset settings to default. Are you sure?
                </p>
                <div class="row-center mt-40">
                    <primary-button
                        class="mr-5"
                        @click="resetToDefaultSettings"
                    >
                        Yes
                    </primary-button>
                     <primary-button
                        @click="resetConfirmMoadal = false"
                    >
                        No
                    </primary-button>
                </div>
            </template>
        </modal>
    </div>
    <loader v-else/>
</template>
<script>
import { mapGetters } from 'vuex';
import { ColorPickerComponent, AddCoverPhotoModal } from '@/components';
import Modal from '@/ui/modal/Modal.vue';
import { getPrimaryCard } from '@/helpers/commonHelpers.js';
import { USER_ROLES } from '@/constants';

export default {
    name: 'ProfileSettings',
    components: {
        ColorPickerComponent,
        AddCoverPhotoModal,
        Modal
    },
    data() {
        return {
            loading: false,
            darkMode: false,
            hidePowereBy: false,
            buttonColor: '',
            backgroundColor: '',
            coverImage: null,
            colorForChange: '',
            changeColorFor: '',
            showColorPicker: false,
            showCoverPictureModal: false,
            coverImagePreview: null,
            changeNotSaved: false,
            showConfirmMoadal: false,
            resetConfirmMoadal: false
        }
    },
    computed: {
        ...mapGetters({
            cardInfo: 'cards/getUserCard',
            userRole: 'user/getUserRole'
        }),
        isFreeUser() {
            return this.userRole === USER_ROLES.INDIVIDUAL
                || this.userRole === USER_ROLES.BUSINESS;
        }
    },
    methods: {
        cancel() {
            this.$router.push({ name: 'Profile' });
        },
        getCardsByAuthUser() {
            this.loading = true;
            this.$store.dispatch('cards/GET_CARDS_BY_AUTH_USER')
                .then((data) => {
                    this.initData(data.data);
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        initData(cardOptions) {
            cardOptions = getPrimaryCard(cardOptions);
            this.darkMode = !!cardOptions?.is_dark_mode;
            this.hidePowereBy = !!cardOptions?.hide_powered_by;
            this.buttonColor = cardOptions?.button_color;
            this.backgroundColor = cardOptions?.background_color;
            this.coverImagePreview = cardOptions?.cover;
        },
        changeColor(color, entity) {
            this.changeColorFor = entity;
            this.colorForChange = color;
            this.showColorPicker = true;
        },
        saveColorAndClose(color) {
            switch (this.changeColorFor) {
                case 'buttonColor':
                    this.buttonColor = color;
                    break;
                case 'backgroundColor':
                    this.backgroundColor = color;
                    break;
            };
            this.showColorPicker = false;
            this.changeColorFor = '';
            this.colorForChange = '';
            this.changeNotSaved = true;
        },
        showPreview(val, src) {
            this.coverImage = val;
            this.coverImagePreview = src;
            this.closeCoverImageModal();
            this.changeNotSaved = true;
        },
        saveSettings() {
            let params = new FormData();
            params.append('_method','PUT');
            params.append('is_dark_mode', Number(this.darkMode));
            params.append('hide_powered_by', Number(this.hidePowereBy));
            params.append('button_color', this.buttonColor);
            params.append('background_color', this.backgroundColor);

            if (this.coverImage) {
                params.append('cover', this.coverImage);
            }

            let requestData = {
                params: params,
                cardId: this.cardInfo.card_id
            };

            let windowPreview = window.open();
            this.$store.dispatch('cards/UPDATE_CARD_WITH_FORMDATA', requestData)
                .then(() => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Settings have been successfully saved.`
                    );
                    this.changeNotSaved = false;
                    let routeData = this.$router.resolve({
                        name: 'PublicProfile',
                        params: { unique_link: this.cardInfo.code },
                        query: {
                            mode: 'preview'
                        }
                    });
                    windowPreview.location = routeData.href;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        deleteCoverImage() {
            let params = new FormData();
            params.append('_method','PUT');
            params.append('cover', '');

            let requestData = {
                params: params,
                cardId: this.cardInfo.card_id
            };

            this.$store.dispatch('cards/UPDATE_CARD_WITH_FORMDATA', requestData)
                .then(() => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your cover photo has been deleted!`
                    );
                    this.coverImagePreview = null;
                    this.coverImage = null;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        resetToDefaultSettings() {
            let params = new FormData();
            params.append('_method','PUT');
            params.append('cover', '');
            params.append('is_dark_mode', 0);
            params.append('hide_powered_by', 0);
            params.append('button_color', '');
            params.append('background_color', '');

            let requestData = {
                params: params,
                cardId: this.cardInfo.card_id
            };

            this.$store.dispatch('cards/UPDATE_CARD_WITH_FORMDATA', requestData)
                .then(() => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your settings have been reset!`
                    );

                    this.darkMode = false;
                    this.hidePowereBy = false;
                    this.buttonColor = '';
                    this.backgroundColor = '';
                    this.coverImage = null;
                    this.coverImagePreview = null;
                    this.changeNotSaved = false;
                    this.resetConfirmMoadal = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        redirectToPlans() {
            this.$router.push({ name: 'Products' });
            this.$store.dispatch(
                'notifications/SHOW_SUCCESS_NOTIFICATION',
                `Upgrade to Pro to use this feature!`
            );
        },
        openCoverImageModal() {
            this.showCoverPictureModal = true;
        },
        closeCoverImageModal() {
            this.showCoverPictureModal = false;
        },
    },
    created() {
        if (!this.cardInfo || !Object.keys(this.cardInfo).length) {
            this.getCardsByAuthUser();
            return;
        }

        this.initData(this.cardInfo);
    },
    beforeRouteLeave(to, from, next) {
        if (this.isFreeUser) {
            this.changeNotSaved = false;
        }

        if (this.changeNotSaved) {
            this.showConfirmMoadal = true;
            return;
        }
        next();
    }
}
</script>
