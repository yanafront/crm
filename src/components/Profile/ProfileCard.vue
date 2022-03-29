<template>
    <div class="profile-card column-start">
        <div class="row-between row-baseline">
            <div
                :class="[
                    'lg-6 sm-12',
                    {'column-start': mScreen}
                ]"
            >
                <div
                    v-if="!cardImage"
                    :class="[
                        'profile-card_image',
                        mScreen ? 'mh-auto' : 'mr-20'
                    ]"
                ></div>
                <div
                    v-else
                    :class="[
                        'profile-card_image',
                        mScreen ? 'mh-auto' : 'mr-20'
                    ]"
                    :style="`
                        background: url(${cardImage}) no-repeat 0% 0%;
                        background-size: cover;
                    `"
                ></div>
                <div class="column-start sm-12">
                    <div class="row-start row-baseline">
                        <p
                            :class="[
                                'f-28-black f-black',
                                mScreen ? 'sm-12 mv-2 t-center' : 'mr-5'
                            ]"
                        >
                            {{ firstName }}
                        </p>
                        <small-border-button
                            class="ml-auto"
                            @click="toEditProfile"
                        >
                            Edit profile
                        </small-border-button>
                        <a
                            class="small-border-button ml-5 mr-auto"
                            :href="`${hostName}/${uniqueUserLink}?mode=preview`"
                            target="_blank"
                        >
                            <share-icon class="i-green mr-4"/>
                            Preview
                        </a>
                    </div>
                    <p
                        :class="[
                            'f-13-black mv-5 pointer text-break flex-no-wrap',
                            mScreen ? 'row-start' : 'row-baseline'
                        ]"
                        v-clipboard="`${hostName}/${uniqueUserLink}`"
                        @click="showCopyAlert"
                    >
                        <link-icon
                            :class="[
                                'i-green mr-1',
                                {'mt-1 flex-row-0' : mScreen}
                            ]"
                            size="12"
                        />
                        {{ hostName }}/{{ uniqueUserLink }}
                    </p>
                </div>
            </div>
            <div
                :class="[
                    'lg-6 sm-12',
                    !mScreen ? 'row-end' : 'mt-5'
                ]"
            >
                <primary-button
                    :class="[mScreen ? 'w-80 mh-auto' : '']"
                    @click="showAddContentModal"
                >
                    <plus-icon class="i-white mr-3"/>
                    Add content
                </primary-button>
                <icon-button
                    class="ml-5"
                    @click="toSettingsPage"
                >
                    <settings-icon />
                </icon-button>
            </div>
        </div>
        <div
            v-if="showContentSection"
            class="row-center pt-20"
        >
            <button
                class="transparent-button"
                @click="showContent = !showContent"
            >
                <arrow-shewron
                    class="i-green mr-1"
                    :transform="showContent ? '-90' : '90'"
                />
                Show content
            </button>
        </div>
    </div>
    <transition name="fade-content">
        <div
            class="w-100 content-preview pt-20"
            v-show="showContent"
        >
            <content-section
                :canDeleteOrEdit="true"
            />
        </div>
    </transition>
    <add-content-modal
        v-if="addModal"
        @close="addModal = false"
        @addPhoto="addPhoto"
        @addDocuments="addDocuments"
        @addEmbedVideo="addModal = false, videoModal = true"
        @addSocialLinks="addModal = false, linksModal = true"
    />
    <upload-file-modal
        v-if="uploadFileModal"
        :uploadedType="modalType"
        @close="uploadFileModal = false"
    />
    <add-video-modal
        v-if="videoModal"
        :showModal="videoModal"
        @close="videoModal = false"
    />
    <add-links-modal
        v-if="linksModal"
        :showModal="linksModal"
        @close="linksModal = false"
    />
</template>

<script>
import {
    SettingsIcon, PlusIcon, LinkIcon, ShareIcon, ArrowShewron
} from '@/icons';
import { USER_ROLES, CONTENT_TYPES } from '@/constants';
import { mapGetters } from 'vuex';
import AddContentModal from './AddContentModal.vue';
import UploadFileModal from './UploadFileModal.vue';
import AddVideoModal from './AddVideoModal.vue';
import AddLinksModal from './AddLinksModal.vue';
import ContentSection from '../PublicProfile/ContentSection.vue';

export default {
    name: 'ProfileCard',
    components: {
        SettingsIcon,
        PlusIcon,
        LinkIcon,
        ShareIcon,
        ArrowShewron,
        AddContentModal,
        UploadFileModal,
        AddVideoModal,
        AddLinksModal,
        ContentSection
    },
    props: {
        cardInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            USER_ROLES,
            addModal: false,
            uploadFileModal: false,
            videoModal:false,
            linksModal:false,
            showContent: false,
            modalType: ''
        }
    },
    computed: {
        ...mapGetters({
            hostName: 'getHostName',
            photoContent: 'content/photoContentSection',
            videoContent: 'content/videoContentSection',
            documentContent: 'content/documentContentSection',
            userRole: 'user/getUserRole',
            uniqueUrlCode: 'user/getUniqueUrl'
        }),
        firstName() {
            if (this.cardInfo?.first_name) {
                return `${this.cardInfo.first_name}`;
            }
        },
        uniqueUserLink() {
            if (this.uniqueUrlCode) {
                return this.uniqueUrlCode;
            } else {
                return '';
            }
        },
        cardImage() {
            if (this.cardInfo?.image) {
                return this.cardInfo.image;
            }
        },
        showContentSection() {
            if (this.userRole === USER_ROLES.INDIVIDUAL
                || this.userRole === USER_ROLES.BUSINESS
            ) {
                return false;
            }

            return this.photoContent?.photos.length
                || this.documentContent?.documents.length
                || this.videoContent?.videos.length;
        }
    },
    watch: {
        showContentSection(newVal) {
            if (!newVal) {
                this.showContent = false;
            }
        }
    },
    methods: {
        toSettingsPage() {
            this.$router.push({ name: 'ProfileSettings' });
        },
        toEditProfile() {
            this.$router.push({ name: 'EditProfile' });
        },
        showCopyAlert() {
            this.$store.dispatch(
                'notifications/SHOW_SUCCESS_NOTIFICATION',
                'Link has been copied to the clipboard.'
            );
        },
        showAddContentModal() {
            this.addModal = true;
        },
        addPhoto() {
            this.addModal = false;
            this.uploadFileModal = true;
            this.modalType = CONTENT_TYPES.PHOTO;
        },
        addDocuments() {
            this.addModal = false;
            this.uploadFileModal = true;
            this.modalType = CONTENT_TYPES.DOCUMENT;
        }
    },
    beforeUnmount() {
        this.modalType = '';
    },
}
</script>
