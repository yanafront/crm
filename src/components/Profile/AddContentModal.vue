<template>
    <modal
        :closeModalOnBackdropClicked="true"
        @close="$emit('close')"
    >
        <template v-slot:title>
            <h1 class="f-20-black f-extrabold mb-2">Add content</h1>
        </template>
        <template v-slot:description>
            <p class="f-13-darkgrey">Upload up to 10 photos, 1 video and 10 pdf files.</p>
        </template>
        <template #body>
            <div>
                <div
                    v-for="(element, index) in typesOfContent"
                    :key="index"
                    class="content-type-item row-baseline row-start mb-4 pointer p-7 br-10 flex-no-wrap"
                    @click="generateEvent(element.emitsEvent, element.title)"
                >
                    <span class="content-type-item_icon s-align-5 mr-20">
                        <component :is="element.icon" class="i-green" size="16"/>
                    </span>
                    <div class="pr-2">
                        <p class="f-15-black f-black">{{ element.title }}</p>
                        <p class="f-14-grey f-medium mt-1">{{ element.description }}</p>
                    </div>
                    <span
                        class="f-10-white f-medium ph-3 pv-1 bg-grey9 br-5 ml-auto"
                        v-if="(userRole === USER_ROLES.INDIVIDUAL
                            || userRole === USER_ROLES.BUSINESS)
                            && element.title !== CONTENT_FOR_FREE_USER"
                    >
                        PRO
                    </span>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import { ImageIcon, LinkIcon, VideoIcon, DocumentIcon } from '@/icons';
import { USER_ROLES } from '@/constants';
import { mapGetters } from 'vuex';

const CONTENT_FOR_FREE_USER = 'Links';

export default {
    name: 'AddContentModal',
    components: {
        Modal,
        ImageIcon,
        LinkIcon,
        VideoIcon,
        DocumentIcon
    },
    data() {
        return {
            USER_ROLES,
            CONTENT_FOR_FREE_USER,
            typesOfContent: [
                {
                    title: 'Photo Gallery',
                    description: 'You can upload up to 10 photos.',
                    emitsEvent: 'addPhoto',
                    icon: 'image-icon'
                },
                {
                    title: 'Links',
                    description: 'Share your Business Website Hyperlink, Named links, Social Links.',
                    emitsEvent: 'addSocialLinks',
                    icon: 'link-icon'
                },
                {
                    title: 'PDF Documents',
                    description: 'You can upload up to 10 PDF files.',
                    emitsEvent: 'addDocuments',
                    icon: 'document-icon'
                },
                {
                    title: 'Video',
                    description: 'Copy and paste video link from Youtube or Vimeo.',
                    emitsEvent: 'addEmbedVideo',
                    icon: 'video-icon'
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole'
        })
    },
    methods: {
        generateEvent(eventName, contentTitle) {
            if ((this.userRole === USER_ROLES.INDIVIDUAL
                || this.userRole === USER_ROLES.BUSINESS)
                && contentTitle !== CONTENT_FOR_FREE_USER
            ) {
                this.$router.push({ name: 'Products' });
                return;
            }

            return this.$emit(eventName);
        }
    }
}
</script>
