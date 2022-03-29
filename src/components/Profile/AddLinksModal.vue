<template>
    <modal
        :closeModalOnBackdropClicked="false"
        @close="$emit('close')"
        class="add-links-modal"
    >
        <template v-slot:title>
            <h1 class="f-20-black f-extrabold mb-2">Add Links</h1>
        </template>
        <template v-slot:description>
            <p class="f-13-darkgrey">These links will be visible on your Public Profile</p>
        </template>
        <template #body>
            <perfect-scrollbar>
                <Form
                    class="h-100 column-start pr-7"
                    :validation-schema="schema"
                    @submit="handleSaveLinks"
                    @invalid-submit="onInvalidSubmit"
                    v-slot="{ errors }"
                >
                    <div class="w-100">
                        <h2 class="f-20-black f-black">Business Website Hyperlink</h2>
                        <p class="f-14-grey f-sbold mt-1">Copy and paste the link from your browser</p>
                        <form-input
                            id="hyperlink"
                            class="w-100 mt-3"
                            name="hyperlink"
                            placeholder="Hyperlink"
                            v-model="businessLinks[0].url"
                            :errors="errors"
                        />
                    </div>
                    <div class="w-100 mt-5">
                        <h2 class="f-20-black f-black">Named link</h2>
                        <p class="f-14-grey f-sbold mt-1">Copy and paste the link from your browser</p>
                        <div
                            class="column-start mt-6 mb-4"
                            v-for="(item, index) in namedLinks"
                            :key="`${index}-${item.id}`"
                        >
                            <div class="mb-4 lg-12 md-12 sm-12">
                                <form-input
                                    :id="`name-${index}-${item.id}`"
                                    class="w-100"
                                    :name="`name-${index}-${item.id}`"
                                    placeholder="Hyperlink name"
                                    v-model="item.name"
                                    :errors="errors"
                                />
                                <icon-button
                                    v-show="namedLinks.length > 1 && index !== 0"
                                    class="mt-1 ml-4 lg-1"
                                    width="30"
                                    height="30"
                                    color="grey"
                                    @click="removeNamedLink(index)"
                                >
                                    <trash-icon />
                                </icon-button>
                            </div>
                            <div
                                :class="[
                                    namedLinks.length > 1 && index !== 0
                                        ? 'lg-11 md-11 sm-11'
                                        : 'lg-12 md-12 sm-12'
                                ]"
                            >
                                <form-input
                                    :id="`namedlink-${index}-${item.id}`"
                                    class="w-100"
                                    :name="`namedlink-${index}-${item.id}`"
                                    placeholder="Hyperlink"
                                    v-model="item.url"
                                    :errors="errors"
                                />
                            </div>
                        </div>
                        <button
                            class="transparent-button f-14-blue f-sbold mr-20"
                            type="button"
                            v-show="namedLinks.length < namedLinksLimit"
                            @click="addNamedLink"
                        >
                            + Add another named link
                        </button>
                    </div>
                    <div class="w-100 column-start mt-5">
                        <h2 class="f-20-black f-black">Social Links</h2>
                        <p class="f-14-grey f-medium mt-1 mb-6">Facebook/ Instagram/ Twitter/ Linkedin</p>
                        <div
                            class="mb-4 lg-12 md-12 sm-12"
                            v-for="(item, index) in profileSocialLinks"
                            :key="item.type"
                        >
                            <div class="form-input-link w-100">
                                <span class="form-input-link_hostname">
                                    <select-input
                                        :options="socialLinksOptions"
                                        :default="item"
                                        @input="setSocialLink($event, index)"
                                    />
                                </span>
                                <input
                                    type="text"
                                    class="form-input-link_field"
                                    placeholder="Social link"
                                    v-model="item.url"
                                >
                            </div>
                            <icon-button
                                v-show="profileSocialLinks.length > 1 && index !== 0"
                                class="mt-1 ml-7"
                                width="30"
                                height="30"
                                color="grey"
                                @click="removeSociaLink(item)"
                            >
                                <trash-icon />
                            </icon-button>
                        </div>
                        <button
                            class="transparent-button f-14-blue f-sbold mr-20"
                            type="button"
                            v-show="socialLinks.length < socialLinksLimit"
                            @click="addSocialLink(false)"
                        >
                            + Add another social link
                        </button>
                    </div>
                    <div class="row-end mt-8 mb-4">
                        <primary-button
                            class="mr-5"
                            buttonType="submit"
                        >
                            Save
                        </primary-button>
                    </div>
                </Form>
            </perfect-scrollbar>
        </template>
    </modal>
</template>

<script>
import { Form } from 'vee-validate';
import Modal from '@/ui/modal/Modal.vue';
import { LINKS_TYPES, USER_ROLES, CONTENT_TYPES } from '@/constants';
import { TrashIcon } from '@/icons';
import * as yup from 'yup';
import { mapGetters } from 'vuex';
// import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.esm'
import { scrollToElementInBlock } from '@/helpers/commonHelpers';

export default {
    name: 'AddLinksModal',
    components: {
        Form,
        Modal,
        TrashIcon,
        PerfectScrollbar
    },
    data() {
        return {
            linksFormData: new FormData(),
            socialLinks: [],
            socialLinksOptions: [
                {
                    title: 'https://www.facebook.com/',
                    type: LINKS_TYPES.FACEBOOK,
                    selected: false
                },
                {
                    title: 'https://www.instagram.com/',
                    type: LINKS_TYPES.INSTAGRAM,
                    selected: false
                },
                {
                    title: 'https://twitter.com/',
                    type: LINKS_TYPES.TWITTER,
                    selected: false
                },
                {
                    title: 'https://www.linkedin.com/',
                    type: LINKS_TYPES.LINKEDIN,
                    selected: false
                }
            ],
            proLinks: [
                {
                    title: 'https://www.paypal.me/',
                    type: LINKS_TYPES.PAYPAL,
                    selected: false
                },
                {
                    title: 'https://www.tiktok.com/',
                    type: LINKS_TYPES.TIKTOK,
                    selected: false
                },
                {
                    title: 'https://venmo.com/',
                    type: LINKS_TYPES.VENMO,
                    selected: false
                },
                {
                    title: 'https://www.zellepay.com/',
                    type: LINKS_TYPES.ZELLE,
                    selected: false
                },
            ],
            businessLinks: [
                {
                    url: '',
                    type: LINKS_TYPES.BUSINESS,
                },
            ],
            namedLinks: [
                {
                    url: '',
                    name: '',
                    type: LINKS_TYPES.COMMON
                },
            ],
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userCardID: 'user/getCardId',
            linksContent: 'content/linksContentSection'
        }),
        // Dynamic Form validation schema
        schema() {
            let baseRules = {
                hyperlink: yup.string().url('Website link must be a valid URL. Copy and paste the link from your browser'),
            }

            this.namedLinks.forEach((link, index) => {
                baseRules[`namedlink-${index}-${link.id}`] = yup.string().url('Website link must be a valid URL. Copy and paste the link from your browser');

                if (link.url) {
                    baseRules[`name-${index}-${link.id}`] = yup.string().required().label('Link name');
                }
            });

            return yup.object(baseRules);
        },
        profileSocialLinks() {
            return this.socialLinks;
        },
        socialLinksLimit() {
            if (this.userRole === USER_ROLES.ADMIN
                || this.userRole === USER_ROLES.INDIVIDUAL_PAID
                || this.userRole === USER_ROLES.BUSINESS_PAID
            ) {
                return 8;
            }

            if (this.userRole === USER_ROLES.INDIVIDUAL
                || this.userRole === USER_ROLES.BUSINESS
            ) {
                return 4;
            }
        },
        namedLinksLimit() {
            if (this.userRole === USER_ROLES.ADMIN
                || this.userRole === USER_ROLES.INDIVIDUAL_PAID
                || this.userRole === USER_ROLES.BUSINESS_PAID
            ) {
                return 5;
            }

            if (this.userRole === USER_ROLES.INDIVIDUAL
                || this.userRole === USER_ROLES.BUSINESS
            ) {
                return 1;
            }
        },
        allLinks() {
            if (this.linksContent) {
                return this.linksContent.links;
            }

            return false;
        }
    },
    methods: {
        initFormData() {
            this.linksFormData.append('section_name', 'Links');
            this.linksFormData.append('section_type', CONTENT_TYPES.LINK);

            if (this.linksContent?.id) {
                this.linksFormData.append('section_id', this.linksContent.id);
            }
        },
        addSocialLink(link) {
            let linkOption;

            // Added link from parseUrl function
            if (link) {
                linkOption = this.socialLinksOptions.find(el => el.type === link.type);
            } else {
                // Added link from button in UI
                linkOption = this.socialLinksOptions.find(el => !el.selected);
            }

            this.socialLinks.push({
                url: '',
                type: linkOption.type,
                hostName: linkOption.title
            });
            linkOption.selected = true;
        },
        setSocialLink(val, index) {
            this.socialLinks[index].type = val.curentOption.type;
            this.socialLinks[index].url = '';

            let link = this.socialLinksOptions.find(el => el.type === val.curentOption.type);
            this.socialLinks[index].hostName = link.title;

            this.socialLinksOptions.forEach((el, index) => {
                if (el.type === val.curentOption.type) {
                    el.selected = true;
                }

                if (el.type === val.prevOption.type) {
                    el.selected = false;
                }
            });
        },
        removeSociaLink(link) {
            let optionLinkIndex = this.socialLinksOptions.findIndex(el => el.type === link.type);
            let linkIndex = this.socialLinks.findIndex(el => el.type === link.type);
            this.socialLinksOptions[optionLinkIndex].selected = false;
            this.socialLinks.splice(linkIndex, 1);
        },
        addNamedLink() {
            this.namedLinks.push({
                url: '',
                name: '',
                type: LINKS_TYPES.COMMON,
            });
        },
        removeNamedLink(index) {
            this.namedLinks.splice(index, 1);
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);

            if (Object.keys(errors).length) {
                let firstMistake = Object.keys(errors)[0];
                scrollToElementInBlock(document.querySelector(`#${firstMistake}`));
            }
        },
        handleSaveLinks(values) {
            let allTypesOfLinks = [
                ...this.businessLinks,
                ...this.namedLinks,
                ...this.socialLinks,
            ];

            if (allTypesOfLinks.length) {
                allTypesOfLinks
                    .filter(item => item.url)
                    .forEach((el, index) => {
                        this.linksFormData.append(`links[${index}][type]`, el.type);

                        if (el.type !== LINKS_TYPES.COMMON
                            && el.type !== LINKS_TYPES.BUSINESS
                        ) {
                            if (el.url.includes(el.hostName)) {
                                this.linksFormData.append(`links[${index}][url]`, el.url);
                            } else {
                                this.linksFormData.append(`links[${index}][url]`, el.hostName + el.url);
                            }
                        } else {
                            this.linksFormData.append(`links[${index}][url]`, el.url);
                        }

                        if (el.type === LINKS_TYPES.COMMON) {
                            this.linksFormData.append(`links[${index}][name]`, el.name);
                        }

                        if (el.id) {
                            this.linksFormData.append(`links[${index}][id]`, el.id);
                        }
                    });
            }

            let requestPayload = {
                cardId: this.userCardID,
                params: this.linksFormData
            }

            this.$store.dispatch('content/ADD_CONTENT_TO_CARD', requestPayload)
                .then(data => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Links have been added.`
                    );
                    this.$emit('close');
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        parseUrl(linksData) {
            // Deep copy links array
            let links = JSON.parse(JSON.stringify(linksData));
            this.socialLinks = [];

            if (links && links.length) {
                let social = [];

                if (this.userRole === USER_ROLES.INDIVIDUAL
                    || this.userRole === USER_ROLES.BUSINESS
                ) {
                    social = links.filter(el => {
                        return el.type !== LINKS_TYPES.COMMON
                            && el.type !== LINKS_TYPES.BUSINESS
                            && el.type !== LINKS_TYPES.PAYPAL
                            && el.type !== LINKS_TYPES.VENMO
                            && el.type !== LINKS_TYPES.TIKTOK
                            && el.type !== LINKS_TYPES.ZELLE;
                    });
                } else {
                    social = links.filter(el => {
                        return el.type !== LINKS_TYPES.COMMON
                            && el.type !== LINKS_TYPES.BUSINESS;
                    });
                }

                let business = links.filter(el => el.type === LINKS_TYPES.BUSINESS);
                let common = links.filter(el => el.type === LINKS_TYPES.COMMON);
                // Set all social links option in false (not selected in dropdown)
                this.socialLinksOptions.forEach(item => item.selected = false);

                social.forEach((item, index) => {
                    let url = new URL(item.url);

                    if (index <= social.length - 1) {
                        this.addSocialLink(item);
                    }

                    this.socialLinks[index].url = url.href.replace(`${url.origin}/`, '');
                    this.socialLinks[index].type = item.type;
                    this.socialLinks[index].hostName= `${url.origin}/`;
                    this.socialLinks[index].id = item.id;
                });

                if (business && business.length) {
                    this.businessLinks = business;
                }

                if (common && common.length) {
                    if (this.userRole === USER_ROLES.INDIVIDUAL
                        || this.userRole === USER_ROLES.BUSINESS
                    ) {
                        this.namedLinks = common.length ? [common[0]] : [];
                    } else {
                        this.namedLinks = common;
                    }
                }
            }
        }
    },
    mounted() {
        if (this.userRole === USER_ROLES.ADMIN
            || this.userRole === USER_ROLES.INDIVIDUAL_PAID
            || this.userRole === USER_ROLES.BUSINESS_PAID
        ) {
            this.socialLinksOptions.push(...this.proLinks);
        }

        this.initFormData();

        if (this.allLinks.length) {
            this.parseUrl(this.allLinks);
        }
    }
}
</script>
