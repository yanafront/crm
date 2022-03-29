<template>
    <div class="form-input-container">
        <label
            v-if="label"
            :for="id"
        >
            {{ label }}
        </label>
        <slot>
            <field
                :id="id"
                :name="name"
                :class="[
                    'form-input-field',
                    { 'form-input-field-invalid': errors && errors[name] }
                ]"
                :type="fieldType"
                :validateOnInput="true"
                :placeholder="placeholder"
                :disabled="disabledAttributePassed"
                v-bind="$attrs"
            />
            <p
                v-if="showErrorMessage"
                class="error-message"
            >
                <error-message :name="name" />
            </p>
        </slot>
    </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate';

export default {
    name: 'FormInput',
    components: {
        Field,
        ErrorMessage
    },
    computed: {
        disabledAttributePassed() {
            if (this.$attrs && this.$attrs.disabled) {
                return !!this.$attrs.disabled;
            }
        }
    },
    props: {
        id: {
            type: [String],
            default: ''
        },
        label: {
            type: [String],
            default: ''
        },
        name: {
            type: [String],
            required: true
        },
        fieldType: {
            type: [String],
            default: 'text'
        },
        placeholder: {
            type: [String],
            default: ''
        },
        errors: {
            type: Object,
            required: false
        },
        showErrorMessage: {
            type: [Boolean],
            default: false
        }
    }
}
</script>
