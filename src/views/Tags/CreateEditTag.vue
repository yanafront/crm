<template>
    <div class="column-start h-100">
        <div
            class="lg-12 row-baseline pointer mb-8 f-15-grey"
            @click="$router.push({ name: 'Tags' })"
        >
            <arrow-shewron
                :transform="180"
                width="14"
                height="14"
                class="i-green mr-2"
            />
            Back to list
        </div>
        <div class="mb-40 lg-12">
            <div class="row-start row-baseline mb-8">
                <h1 class="f-28-black f-black">
                    <template v-if="isEditMode">
                        Update Tag
                    </template>
                    <template v-else>
                        Create Tag
                    </template>
                </h1>
            </div>
        </div>
        <Form
            class="row-start"
            :validation-schema="schema"
            :initial-values="formValues"
            @submit="submitForm"
            @invalid-submit="onInvalidSubmit"
            v-slot="{ errors }"
        >
            <div class="lg-6 md-6 sm-12">
                <form-input
                    id="code"
                    class="w-100 pr-4 pr-sm-0 mb-sm-1"
                    label="Tag"
                    name="code"
                    placeholder="Tag"
                    :errors="errors"
                />

            </div>
            <div class="lg-1 sm-12 mt-auto">
                <primary-button
                    :class="{ 'w-100': mScreen }"
                    type="submit"
                >
                    <template v-if="isEditMode">
                        Save
                    </template>
                    <template v-else>
                        Create
                    </template>
                </primary-button>
            </div>
        </Form>
    </div>
</template>

<script>
import { ArrowShewron } from '@/icons';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { mapGetters } from 'vuex';

export default {
    name: 'CreateEditTag',
    components: {
        ArrowShewron,
        Form
    },
    data() {
        const schema = yup.object({
            code: yup.string().required('Code is required field!')
        });

        return {
            schema,
            formValues: {
                code: ''
            },
            editedTagId: null
        }
    },
    computed: {
        ...mapGetters({

        }),
        isEditMode() {
            return !!this.$route?.query?.tag;
        }
    },
    methods: {
        submitForm(value) {
            if (!this.isEditMode) {
                this.$store.dispatch('tags/CREATE_TAG', value)
                    .then((data) => {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Tag has been created successfully!`
                        );
                        this.$router.push({ name: 'Tags' });
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            } else {
                let requesPayload = {
                    params: value,
                    tagId: this.editedTagId
                }

                this.$store.dispatch('tags/UPDATE_TAG', requesPayload)
                    .then((data) => {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Tag has been updated successfully!`
                        );
                        this.$router.push({ name: 'Tags' });
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            }
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
    },
    created() {
        if (this.$route?.query) {
            this.formValues.code = this.$route.query?.tag;
            this.editedTagId = this.$route.query?.tag_id;
        }
    }
}
</script>
