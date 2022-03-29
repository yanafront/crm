<template>
    <div
        :class="[
            'public-profile-card',
            mScreen ? 'column-start' : 'row-start mb-20'
        ]"
        :style="{ backgroundColor: `${cardBackgroundColor}` }"
    >
        <div
            class="public-cover-photo"
            v-if="cardInfo.cover"
        >
            <div class="public-cover-photo-container">
                <img :src="cardInfo.cover" />
            </div>
        </div>
        <div
            :class="[
                'public-profile-card-body',
                {'public-profile-card_with-cover': cardInfo.cover},
                mScreen ? 'column-center sm-12' : 'row-start lg-10 nb-8 md-9'
            ]"
        >
            <div
                v-if="!cardImage"
                class="public-profile-card_photo"
            ></div>
            <div
                v-else
                class="public-profile-card_photo pointer"
                :style="`
                    background: url(${cardImage}) no-repeat 0% 0%;
                    background-size: cover;
                `"
                @click="showAvatarPopup(cardImage)"
            ></div>
            <div
                :class="[
                    mScreen ? 'column-center' : 'column-start pt-4 lg-10 nb-8 md-9'
                ]"
            >
                <h2 class="f-20-black f-black t-center">{{ fullName }}</h2>
                <p class="f-13-grey f-normal mt-2 mb-3">{{ jobInfo }}</p>
                <div
                    :class="[
                        mScreen ? 'column-center' : 'row-start row-baseline'
                    ]"
                >
                    <span
                        :class="[
                            mScreen ? 's-align-2 w-80' : 'mr-2'
                        ]"
                    >
                        <link-icon
                            class="i-green mr-1 flex-shrink-0"
                            size="12"
                            :style="{ fill: `${buttonColor}` }"
                        />
                        <span
                            :class="[
                                'f-13-green t-center pointer',
                                {'text-break ': detectLinkLength(`${hostName}/${uniqueUserLink}`) }
                            ]"
                            :style="{ color: `${buttonColor}` }"
                            v-clipboard="`${hostName}/${uniqueUserLink}`"
                            @click="showCopyAlert"
                        >
                            {{ hostName }}/{{ uniqueUserLink }}
                        </span>
                    </span>
                    <span
                        v-if="socialLinks.length"
                        :class="[
                            mScreen ? 'row-center mt-8' : 'lg-4'
                        ]"
                    >
                        <a
                            v-for="(item, index) in socialLinks"
                            :key="item.id"
                            :class="[
                                'round-icon',
                                {'mr-2': index !== socialLinks.length - 1},
                                {'mb-2' : mScreen}
                            ]"
                            :href="item.url"
                            @click="saveLinkAction(item.id)"
                            @click.middle="saveLinkAction(item.id)"
                            @contextmenu="saveLinkAction(item.id)"
                            target="_blank"
                            :style="{ backgroundColor: `${buttonColor}` }"
                        >
                            <component
                                :class="[ buttonColor ? 'color-invert' : 'i-white']"
                                :is="`${item.type}-icon`"
                            />
                        </a>
                    </span>
                </div>
                <div
                    :class="[
                        mScreen ? 'column-center mt-8' : 'row-start row-baseline mt-2'
                    ]"
                    v-if="businessLink.length"
                >
                    <p
                        :class="[
                            {'s-align-2 t-center w-80' : mScreen}
                        ]"
                    >
                        <link-icon
                            class="i-green mr-1 flex-shrink-0"
                            size="12"
                            :style="{ fill: `${buttonColor}` }"
                        />
                        <a
                            :class="[
                                'f-13-green',
                                {'text-break': detectLinkLength(businessLink[0].url) }
                            ]"
                            :href="businessLink[0].url"
                            :style="{ color: `${buttonColor}` }"
                            @click="saveLinkAction(businessLink[0].id)"
                            @click.middle="saveLinkAction(businessLink[0].id)"
                            @contextmenu="saveLinkAction(businessLink[0].id)"
                            target="_blank"
                        >
                            {{ businessLink[0].url}}
                        </a>
                    </p>
                </div>
                <div
                    :class="[
                        mScreen ? 'column-center' : 'row-baseline'
                    ]"
                >
                    <p
                        :class="[
                            'f-13-black',
                            mScreen ? 'column-center mt-7' : 'column-start mt-4'
                        ]"
                        :style="{ color: `${buttonColor}` }"
                        v-if="phones.length"
                    >
                        <span
                            :class="[
                                {'mr-30' : !mScreen },
                                {'mt-1': index !== 0}
                            ]"
                            v-for="(phone, index) in phones"
                            :key="phone.id"
                        >
                            <phone-icon
                                class="i-green mr-1"
                                :style="{ fill: `${buttonColor}` }"
                            />
                            <a
                                :href="`tel:+${removePhoneMask(phone.number)}`"
                            >
                                {{ phone.number }}
                            </a>
                        </span>
                    </p>
                    <p
                        :class="[
                            'f-13-black mt-4',
                            mScreen ? 'column-center' : 'column-start'
                        ]"
                        :style="{ color: `${buttonColor}` }"
                        v-if="emails.length"
                    >
                        <span
                            :class="[{'mt-2': index !== 0}]"
                            v-for="(email, index) in emails"
                            :key="email.id"
                        >
                            <email-icon
                                class="i-green mr-1"
                                :style="{ fill: `${buttonColor}` }"
                            />
                            <a
                                :href="`mailto:${email.email}`"
                            >
                                {{ email.email }}
                            </a>
                        </span>
                    </p>
                </div>
                <div
                    :class="[
                        mScreen ? 'row-center mt-8' : 'column-start'
                    ]"
                    v-if="commonLink.length"
                >
                    <p
                        :class="['mt-2', {'s-align-2 t-center w-80' : mScreen}]"
                        v-for="item in commonLink"
                        :key="item.id"
                    >
                        <link-icon
                            class="i-green mr-1 flex-shrink-0"
                            size="12"
                            :style="{ fill: `${buttonColor}` }"
                        />
                        <a
                            :class="[
                                'f-13-green',
                                {'text-break': detectLinkLength(`Click here to see ${item.name}`) }
                            ]"
                            :style="{ color: `${buttonColor}` }"
                            :href="item.url"
                            @click="saveLinkAction(item.id)"
                            @click.middle="saveLinkAction(item.id)"
                            @contextmenu="saveLinkAction(item.id)"
                            target="_blank"
                        >
                            {{ item.name }}
                        </a>
                    </p>
                </div>
            </div>
        </div>
        <div
            :class="[
                'public-profile-card-footer',
                {'public-profile-card_with-cover': cardInfo.cover},
                mScreen ? 'column-start lg-12 mt-50' : 'row-end lg-2 nb-4 md-3'
            ]"
        >
            <div :class="[ mScreen ? 'w-100' : 'column-end']">
                <button
                    :class="[
                        'w-100 primary-button pointer',
                        { 's-align-3': mScreen }
                    ]"
                    :style="{ backgroundColor: `${buttonColor}` }"
                    @click="actionButtonIsActive ? saveContact() : ''"
                >
                    <template v-if="buttonColor">
                        <span class="color-invert">Save Contact</span>
                    </template>
                    <template v-else>
                        Save Contact
                    </template>
                </button>
                <primary-button
                    :class="[
                        'mt-3',
                        { 'w-100': mScreen }
                    ]"
                    :style="{ backgroundColor: `${buttonColor}` }"
                    @click="actionButtonIsActive ? shareContact() : ''"
                >
                    <template v-if="buttonColor">
                        <span class="color-invert">Share My Contact</span>
                    </template>
                    <template v-else>
                        Share My Contact
                    </template>
                </primary-button>
            </div>
        </div>
        <modal
            :closeModalOnBackdropClicked="true"
            @close="closeAvatarPopup"
            v-if="showAvatar"
        >
            <template v-slot:title>
                <h1 class="f-20-black f-extrabold mb-2">
                    Profile photo
                </h1>
            </template>
            <template #body>
                <div class="row-center">
                    <img
                        class="avatar-full-photo"
                        :src="avatarUrl"
                    >
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import {
    LinkIcon, PhoneIcon, EmailIcon, FacebookIcon, LinkedinIcon,
    InstagramIcon, TwitterIcon, TiktokIcon, PaypalIcon, VenmoIcon,
    ZelleIcon
} from '@/icons';
import Modal from '@/ui/modal/Modal.vue';
import { LINKS_TYPES, ACTION_ENTITY_TYPES, ACTION_TYPES, USER_ROLES } from '@/constants';
import { mapGetters } from 'vuex';
import { getTemporarilyLink } from '@/helpers/commonHelpers.js';

export default {
    name: "PublicProfileCard",
    components: {
        LinkIcon,
        PhoneIcon,
        EmailIcon,
        FacebookIcon,
        LinkedinIcon,
        InstagramIcon,
        TwitterIcon,
        TiktokIcon,
        PaypalIcon,
        VenmoIcon,
        ZelleIcon,
        Modal
    },
    props: {
        cardInfo: {
            type: Object,
            required: true
        },
        saveVisitorActions: {
            type: Boolean,
            required: true
        }
    },
    emits: ['shareContact'],
    data() {
        return {
            LINKS_TYPES,
            cardViewSaved: false,
            showAvatar: false,
            avatarUrl: null
        }
    },
    computed: {
        ...mapGetters({
            publicUserRole: 'cards/userRoleInPublicProfile',
            systemUserRole: 'user/getUserRole',
            hostName: 'getHostName',
            deviceId: 'analytics/getDeviceId',
            linksContent: 'content/linksContentSection'
        }),
        fullName() {
            let fullName = '';
            if (Object.keys(this.cardInfo).length) {
                fullName = this.cardInfo?.first_name || '';
                fullName += this.cardInfo?.last_name ? ` ${this.cardInfo?.last_name}` : '';
            }

            return fullName;
        },
        jobInfo() {
            let job = ''
            if (this.cardInfo?.job_title) {
                job = `${this.cardInfo.job_title}`;
            }

            if (this.cardInfo?.job_title && this.cardInfo?.company_name) {
                job += ` at `;
            }

            if (this.cardInfo?.company_name) {
                job += `${this.cardInfo.company_name}`;
            }

            return job;
        },
        uniqueUserLink() {
            if (this.cardInfo?.code) {
                return `${this.cardInfo.code}`;
            } else {
                return '';
            }
        },
        cardImage() {
            if (this.cardInfo?.image) {
                return this.cardInfo.image;
            }
        },
        phones() {
            return this.cardInfo?.phones;
        },
        emails() {
            return this.cardInfo?.emails;
        },
        userRole() {
            return this.$route.name === 'PublicProfile'
                ? this.publicUserRole : this.systemUserRole;
        },
        socialLinks() {
            if (this.linksContent?.links && this.linksContent.links.length) {
                if (this.userRole === USER_ROLES.INDIVIDUAL
                    || this.userRole === USER_ROLES.BUSINESS
                ) {
                    return this.linksContent.links.filter(link => {
                        return link.type !== LINKS_TYPES.COMMON
                            && link.type !== LINKS_TYPES.BUSINESS
                            && link.type !== LINKS_TYPES.PAYPAL
                            && link.type !== LINKS_TYPES.VENMO
                            && link.type !== LINKS_TYPES.TIKTOK
                            && link.type !== LINKS_TYPES.ZELLE;
                    });
                } else {
                    return this.linksContent.links.filter(link => {
                        return link.type !== LINKS_TYPES.COMMON
                            && link.type !== LINKS_TYPES.BUSINESS;
                    });
                }
            } else {
                return [];
            }
        },
        commonLink() {
            if (this.linksContent?.links && this.linksContent.links.length) {
                let commonLinks = this.linksContent.links.filter(link => link.type === LINKS_TYPES.COMMON);

                if (this.userRole === USER_ROLES.INDIVIDUAL
                    || this.userRole === USER_ROLES.BUSINESS
                ) {
                    return commonLinks.length ? [commonLinks[0]] : [];
                } else {
                    return commonLinks;
                }
            } else {
                return [];
            }
        },
        businessLink() {
            if (this.linksContent?.links && this.linksContent.links.length) {
                return this.linksContent.links.filter(link => link.type === LINKS_TYPES.BUSINESS);
            } else {
                return [];
            }
        },
        actionButtonIsActive() {
            return this.saveVisitorActions;
        },
        vcfLoadLink() {
            return `${process.env.VUE_APP_URL}/api/cards/${this.cardInfo.card_id}/download-vcf`;
        },
        buttonColor() {
            if (this.cardInfo.button_color !== 'null') {
                return this.cardInfo?.button_color;
            }
        },
        cardBackgroundColor() {
            if (this.cardInfo.background_color !== 'null') {
                return this.cardInfo?.background_color;
            }
        }
    },
    watch: {
        deviceId: function () {
            if (!this.cardViewSaved) {
                this.saveCardAction();
            }
        }
    },
    methods: {
        removePhoneMask(phone) {
            return phone.replace(/\D+/g, '');
        },
        saveContact() {
            if (!this.cardInfo?.card_id) {
                this.$store.dispatch(
                    'notifications/SHOW_ERROR_NOTIFICATION',
                    'Please refresh the page!'
                );
                return;
            }

            let formData = {
                device_id: this.deviceId,
                entity_id: this.cardInfo.card_id,
                entity_type: ACTION_ENTITY_TYPES.CARD,
                action_type: ACTION_TYPES.DOWNLOAD
            };

            this.saveAction(formData);

            setTimeout(() => {
                getTemporarilyLink(this.vcfLoadLink);
            }, 1000);

            setTimeout(() => {
                this.$emit('shareContact');
            }, 1000);
        },
        saveCardAction() {
            if (this.saveVisitorActions && this.deviceId !== null && !this.cardViewSaved) {
                let formData = {
                    device_id: this.deviceId,
                    entity_id: this.cardInfo.card_id,
                    entity_type: ACTION_ENTITY_TYPES.CARD,
                    action_type: ACTION_TYPES.VIEW
                };
                this.cardViewSaved = true;
                this.saveAction(formData);
            }
        },
        saveLinkAction(linkId) {
            if (this.saveVisitorActions) {
                let formData = {
                    device_id: this.deviceId,
                    entity_id: linkId,
                    entity_type: ACTION_ENTITY_TYPES.LINK,
                    action_type: ACTION_TYPES.CLICK
                };
                this.saveAction(formData);
            }
        },
        saveAction(formData) {
            this.$store.dispatch('analytics/SAVE_ACTION', formData)
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        shareContact() {
            this.$emit('shareContact');
        },
        detectLinkLength(link) {
            if (link) {
                return link.length > 45;
            } else {
                return false;
            }
        },
        showCopyAlert() {
            this.$store.dispatch(
                'notifications/SHOW_SUCCESS_NOTIFICATION',
                'Link has been copied to the clipboard.'
            );
        },
        showAvatarPopup(url) {
            this.showAvatar = true;
            this.avatarUrl = url;
        },
        closeAvatarPopup() {
            this.showAvatar = false;
            this.avatarUrl = null;
        }
    },
    created() {
        this.saveCardAction();
    }
}
</script>
