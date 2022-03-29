
<template>
    <div>
        <div class="title">
            <h1>Style Guide</h1>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold">Buttons</h2>
        </div>
        <div class="w-100 column-start">
            <div class="row-start pb-8">
                <primary-button class="mr-2">Primary button</primary-button>
                <primary-button class="mr-2">
                    <plus-icon class="i-white mr-3"/>
                    Primary button with icon
                </primary-button>
                <border-button class="mr-2">Cancel button</border-button>
                <border-button class="green-border-button mr-2">
                    <plus-icon class="i-green mr-3"/>
                    Add New email
                </border-button>
                <danger-button class="mr-2">
                    <trash-icon class="i-white mr-3"/>
                    Delete
                </danger-button>
                <div>
                    <small-border-button>
                        Edit profile
                    </small-border-button>
                </div>
            </div>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold">Icon Buttons</h2>
        </div>
        <div class="w-100 column-start">
            <div class="row-start pb-8">
                <div class="column-center lg-4 md-6 sm-6 mb-4">
                    <p class="pb-2">Default</p>
                    <p class="pb-2">props: [width (default 43), height (default 45), color (default green)]</p>
                    <icon-button>
                        <settings-icon />
                    </icon-button>
                </div>
                <div class="column-center lg-4 md-6 sm-6 mb-4">
                    <p class="pb-2">Customized with props</p>
                    <p class="pb-2">props: [width="30", height="30", color="grey"]</p>
                    <icon-button
                        width="30"
                        height="30"
                        color="grey"
                    >
                        <trash-icon />
                    </icon-button>
                </div>
            </div>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold">Inputs</h2>
        </div>
        <div class="row-start">
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="f-14-black mb-8">props: [options, default]</p>
                <p class="f-14-black mb-8">Events: [input]</p>
                <select-input
                    :options="options"
                    :default="options[0]"
                />
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="f-14-black mb-8">Props: </p>
                <p class="f-14-black mb-8">Events: </p>
                <form-input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                />
            </div>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold">Toggle Switch</h2>
        </div>
        <p class="f-14-black mb-8">props: color (green - default)</p>
        <div class="row-start">
            <toggle-switch>
                <input
                    type="checkbox"
                />
            </toggle-switch>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold">Modals</h2>
        </div>
        <div class="row-start pb-8">
            <primary-button
                class="mr-2"
                @click="showModal = true"
            >
                Show Modal
            </primary-button>
            <modal
                v-if="showModal"
                @close="showModal = false"
            >
                <template v-slot:title>
                    <h1 class="f-20-black f-extrabold mb-2">Modal title</h1>
                </template>
                <template v-slot:description>
                    <p class="f-13-darkgrey">Modal description</p>
                </template>
                <template v-slot:body>
                    <div>
                        <Form
                            :validation-schema="schema"
                            @submit="handleLoginForm"
                            @invalid-submit="onInvalidSubmit"
                            v-slot="{ errors }"
                        >
                            <form-input
                                id="username"
                                label="Email"
                                name="username"
                                placeholder="Your email"
                                :errors="errors"
                            />
                            <div class="row-end">
                                <border-button
                                    class="mr-2"
                                    @click="showModal = false"
                                >
                                    Cancel
                                </border-button>
                                <primary-button
                                    class="ml-2"
                                    buttonType="submit"
                                >Save</primary-button>
                            </div>
                        </Form>
                    </div>
                </template>
                <template v-slot:footer>
                </template>
            </modal>
        </div>
        <div class="pv-30">
            <h2 class="f-18-darkgrey f-sbold mb-8">Icons</h2>
        </div>
        <div class="row-start mv-8">
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'signout-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <signout-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'settings-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <settings-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'trash-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <trash-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'facebook-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <facebook-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'eye-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <eye-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'arrow-pointer-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <arrow-pointer-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'not-found-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <not-found-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'arrow-shewron'</p>
                <p class="pb-2">props: [width, height]</p>
                <arrow-shewron width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'upload-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <upload-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'pdf-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <pdf-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'video-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <video-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'document-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <document-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'tiktok-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <tiktok-icon size="14"/>
            </div>
            <div class="column-center lg-2 md-2 sm-6 mb-4">
                <p class="pb-2">'zelle-icon'</p>
                <p class="pb-2">props: [width, height]</p>
                <zelle-icon width="14" height="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'window-icon'</p>
                <p class="pb-2">prop: size</p>
                <window-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'contacts-icon'</p>
                <p class="pb-2">prop: size</p>
                <contacts-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'analytics-icon'</p>
                <p class="pb-2">prop: size</p>
                <analytics-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'plus-icon'</p>
                <p class="pb-2">prop: size</p>
                <plus-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'close-icon'</p>
                <p class="pb-2">prop: size</p>
                <close-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'link-icon'</p>
                <p class="pb-2">prop: size</p>
                <link-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'share-icon'</p>
                <p class="pb-2">prop: size</p>
                <share-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'phone-icon'</p>
                <p class="pb-2">prop: size</p>
                <phone-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'email-icon'</p>
                <p class="pb-2">prop: size</p>
                <email-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'linkedin-icon'</p>
                <p class="pb-2">prop: size</p>
                <linkedin-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'instagram-icon'</p>
                <p class="pb-2">prop: size</p>
                <instagram-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'twitter-icon'</p>
                <p class="pb-2">prop: size</p>
                <twitter-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'dashboard-icon'</p>
                <p class="pb-2">prop: size</p>
                <dashboard-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'arrow-icon'</p>
                <p class="pb-2">prop: size</p>
                <arrow-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'calendar-icon'</p>
                <p class="pb-2">prop: size</p>
                <calendar-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'image-icon'</p>
                <p class="pb-2">prop: size</p>
                <image-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'paypal-icon'</p>
                <p class="pb-2">prop: size</p>
                <paypal-icon size="14"/>
            </div>
            <div class="column-center lg-1 md-2 sm-6 mb-4">
                <p class="pb-2">'venmo-icon'</p>
                <p class="pb-2">prop: size</p>
                <venmo-icon size="14"/>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import {
    WindowIcon, ContactsIcon, AnalyticsIcon, SignoutIcon, SettingsIcon, TrashIcon,
    PlusIcon, CloseIcon, LinkIcon, ShareIcon, PhoneIcon, EmailIcon, FacebookIcon,
    LinkedinIcon, InstagramIcon, TwitterIcon, EyeIcon, ArrowPointerIcon, NotFoundIcon,
    DashboardIcon, ArrowIcon, CalendarIcon, ArrowShewron, ImageIcon, VideoIcon,
    DocumentIcon, UploadIcon, PdfIcon, TiktokIcon, PaypalIcon, VenmoIcon, ZelleIcon
} from '@/icons';

export default {
    name: 'StyleGuide',
    components: {
        Modal,
        Form,
        WindowIcon,
        ContactsIcon,
        AnalyticsIcon,
        SignoutIcon,
        SettingsIcon,
        TrashIcon,
        PlusIcon,
        CloseIcon,
        LinkIcon,
        ShareIcon,
        PhoneIcon,
        EmailIcon,
        FacebookIcon,
        LinkedinIcon,
        InstagramIcon,
        TwitterIcon,
        EyeIcon,
        ArrowPointerIcon,
        NotFoundIcon,
        DashboardIcon,
        ArrowIcon,
        CalendarIcon,
        ArrowShewron,
        ImageIcon,
        VideoIcon,
        DocumentIcon,
        UploadIcon,
        PdfIcon,
        TiktokIcon,
        PaypalIcon,
        VenmoIcon,
        ZelleIcon
    },
    data() {
        // Form validation schema
        const schema = yup.object({
            username: yup.string().required().email().label('Email')
        });

        return {
            showModal: false,
            schema,
            options: ['Mobile', 'Work']
        }
    },
    methods: {
        handleLoginForm(values, { resetForm }) {
            console.log(values);
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        }
    }
}
</script>
