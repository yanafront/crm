<template>
    <div class="column-start h-100">
        <div class="mb-40 lg-12">
            <div class="row-start row-baseline mb-8">
                <h1 class="f-28-black f-black">Tags</h1>
            </div>
        </div>
        <div class="lg-12 sm-12 row-end row-baseline">
            <div
                :class="[
                    'lg-2 sm-12 ',
                    mScreen ? 'mb-5' : 's-align-5 pr-8'
                ]"
            >
                <vue-select
                    class="w-100"
                    :options="boundFilterOptions"
                    label-by="id"
                    close-on-select
                    v-model="selectedFilterOption"
                    @selected="getTagsByFilter($event)"
                >
                    <template #label="{ selected }">
                        <template v-if="selected">
                            <div>
                                {{ `${selected.title}` }}
                            </div>
                        </template>
                        <template v-else>Filter by bound/not bound</template>
                    </template>
                    <template #dropdown-item="{ option }">
                        <div>
                            {{ `${option.title}` }}
                        </div>
                    </template>
                </vue-select>
            </div>
            <primary-button
                :class="[mScreen ? 'w-100 mb-5': '']"
                @click="showModal = true"
            >
                Generate file
            </primary-button>
            <!-- <primary-button
                :class="[{'w-100 mb-5 ': mScreen}]"
                @click="$router.push({ name: 'CreateEditTag' })"
            >
                <plus-icon class="i-white mr-6"/>
                Create Tag
            </primary-button> -->
        </div>
        <div
            v-if="!loading"
            class="w-100 h-100 mt-20"
        >
            <div
                v-if="cardsList.length"
                class="w-100 h-100"
            >
                <dynamic-table
                    :header="tableHeader"
                    :tableData="cardsList"
                    :optionsForRender="optionsForRender"
                />
                <div class="row-center pv-8">
                    <load-more
                        v-if="isMorePages"
                        :status="loadingStatus"
                        @click="getTagsList"
                    />
                </div>
            </div>
            <div
                v-else
                class="h-100 w-100 s-align-5"
            >
                <p class="f-18-grey">Your page is empty</p>
            </div>
        </div>
        <loader v-else />
        <modal
            v-if="showModal"
            class="generate-tags-modal"
            :closeModalOnBackdropClicked="false"
            @close="showModal = false"
        >
            <template #title>
                <h1 class="f-20-black f-bold mb-2 t-center">
                    Generate xlsx file with tag.
                </h1>
            </template>
            <template #description>
                <p class="f-13-darkgrey">Fill in the field, how many tags you need to create.</p>
            </template>
            <template #body>
                <Form
                    class="row-start"
                    :validation-schema="schema"
                    :initial-values="formValues"
                    @submit="generateXlsxFile"
                    @invalid-submit="onInvalidSubmit"
                    v-slot="{ errors }"
                >
                    <div class="lg-12 sm-12">
                        <form-input
                            id="number"
                            class="w-100 pr-8 pr-sm-1 mb-sm-1"
                            label="Tugs amount"
                            name="number"
                            placeholder="Tugs amount"
                            :errors="errors"
                        />

                    </div>
                    <div class="lg-12 mt-5 row-center">
                        <primary-button
                            class="mr-5"
                            type="submit"
                        >
                            Generate file
                        </primary-button>
                        <border-button
                            class="mr-6"
                            @click="showModal = false"
                        >
                            Cancel
                        </border-button>
                    </div>
                </Form>
            </template>
        </modal>
    </div>
</template>

<script>
import { PlusIcon } from '@/icons';
import { DynamicTable } from '@/components';
import { Form } from 'vee-validate';
import Modal from '@/ui/modal/Modal.vue';
import * as yup from 'yup';
import { mapGetters } from 'vuex';

export default {
    name: 'Tags',
    components: {
        PlusIcon,
        DynamicTable,
        Form,
        Modal
    },
    data() {
        const schema = yup.object({
            number: yup.number()
                        .typeError("Number field must be an integer")
                        .integer()
                        .min(1, 'Min value 1.')
                        .max(1000, 'Max value 1000.')
                        .required()
        });

        return {
            schema,
            formValues: {
                number: 0
            },
            loading: false,
            loadingStatus: false,
            cardsList: [],
            tableHeader: ['Tag', 'Created', 'Bound', 'Card Code', 'Card owner'],
            optionsForRender: ['code', 'created_at', 'bound_at', 'cardCode', 'cardOwner'],
            totalCards: null,
            isMorePages: false,
            pageNumber: 1,
            showModal: false,
            boundFilterOptions: [
                {
                    id: 1,
                    bound: -1,
                    title: 'All Tags'
                },
                {
                    id: 2,
                    bound: 1,
                    title: 'Bound Tags'
                },
                {
                    id: 3,
                    bound: 0,
                    title: 'Not Bound Tags'
                }
            ],
            selectedFilterOption: null,
        }
    },
    computed: {
        ...mapGetters({

        }),
    },
    methods: {
        generateXlsxFile(value, actions) {
            this.$store.dispatch('tags/GENERATE_XLSX_FILE', value)
                .then((response) => {
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const objectURL = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');

                    link.href = objectURL;
                    link.click();
                    link.remove();
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `File with tags has been downloaded!`
                    );

                    this.showModal = false;
                    this.loading = true;
                    this.resetPagination();
                    this.getTagsList();
                    actions.setFieldValue('number', 0);
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        getTagsList() {
            let params = {
                perPage: 50
            };

            if (this.pageNumber > 1) {
                Object.assign(params, { page: this.pageNumber });
            }

            if (this.selectedFilterOption && this.selectedFilterOption.bound !== -1) {
                Object.assign(params, { is_bound: this.selectedFilterOption.bound });
            }

            this.pageNumber++;
            this.loadingStatus = true;
            this.$store.dispatch('tags/GET_TAGS_LIST', params)
                .then((data) => {
                    this.cardsList.push(...data.data.data);
                    this.totalCards = data.data.total;
                    data.data.current_page === data.data.last_page
                        ? this.isMorePages = false
                        : this.isMorePages = true;
                    this.loadingStatus = false;
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        resetPagination() {
            this.pageNumber = 1;
            this.isMorePages = false;
            this.cardsList = [];
        },
        getTagsByFilter() {
            this.loading = true;
            this.$nextTick(() => {
                this.resetPagination();
                this.getTagsList();
            });
        },
    },
    created() {
        this.loading = true;
        this.getTagsList();
    }
}
</script>
