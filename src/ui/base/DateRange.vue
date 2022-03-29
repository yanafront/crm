<template>
    <date-picker
        v-model="range"
        mode="date"
        color="gray"
        class="relative w-100"
        update-on-input
        :masks="masks"
        is-range
        timezone='UTC'
        locale="en"
    >
        <template v-slot="{ inputValue, inputEvents }">
            <div class="form-input-container form-input-container_date relative">
                <input
                    :class="[
                        'form-input-field ',
                    ]"
                    :value="`${inputValue.start} - ${inputValue.end}`"
                    v-on="inputEvents.start"
                />
                <calendar-icon class="i-green" size="16"/>
            </div>
        </template>
    </date-picker>
</template>

<script>
import { DatePicker } from 'v-calendar';
import { CalendarIcon } from '@/icons';

export default {
    name: 'DateRange',
    components: {
        DatePicker,
        CalendarIcon
    },
    data() {
        return {
            range: {
                start: new Date(),
                end: new Date(),
            },
            masks: {
                // input: 'YYYY-MM-DD h:mm A',
                input: "MMM DD, YYYY"
            }
        }
    },
    props: {

    },
    watch: {
        range(newVal) {
            console.log(newVal.start);
        }
    }
}
</script>
