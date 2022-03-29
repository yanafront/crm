<template>
    <modal
        class="wipe-out-modal"
        @close="$emit('close')"
    >
        <template #title>
            <h1 class="f-20-black f-bold mb-2 t-center">
                Deleting all the info
            </h1>
        </template>
        <template #description>
            <p class="f-13-darkgrey">This will delete all the info. Are you sure?</p>
        </template>
        <template #body>
            <div
                v-if="!confirmWipeOut"
                class="row-end"
            >
                <border-button
                    class="mr-6"
                    @click="$emit('close')"
                >
                    No
                </border-button>
                <danger-button @click="confirmWipeOut = true">
                    Yes
                </danger-button>
            </div>
            <Form
                v-if="confirmWipeOut"
                :validation-schema="schema"
                @submit="submitForm"
                @invalid-submit="onInvalidSubmit"
                v-slot="{ errors }"
                class="w-100"
            >
                <form-input
                    id="email"
                    class="lg-12 mb-25"
                    label="New user’s email"
                    name="email"
                    placeholder="Email"
                    :errors="errors"
                />
                <form-input
                    id="password"
                    class="lg-12 mb-25"
                    label="New password"
                    name="password"
                    placeholder="Password"
                    :errors="errors"
                />
                <div class="row-end">
                    <border-button
                        class="mr-6"
                        type="button"
                        @click="$emit('close')"
                    >
                        Cancel
                    </border-button>
                    <primary-button
                        type="submit"
                    >
                        Confirm
                    </primary-button>
                </div>
            </Form>
        </template>
    </modal>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'WipeOutModal',
    components: {
        Modal,
        Form
    },
    props: {
        cardId: {
            type: [Number, String],
            required: true
        }
    },
    emits: ['getUsers', 'close'],
    data() {
        // Form validation schema
        const schema = yup.object({
            email: yup.string().required().email().label('Email'),
            password: yup.string().required().min(8).label('Password')
        });

        return {
            schema,
            confirmWipeOut: false,
        }
    },
    methods: {
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        submitForm(values) {
            let requestPayload = {
                params: values,
                cardId: this.cardId
            }

            this.$store.dispatch('users/WIPE_OUT_CARD', requestPayload)
                .then((data) => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Wiping out has finished successfully!`
                    );
                    this.$emit('getUsers');
                    this.$emit('close');
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    }
}
</script>
