<template>
    <svg
        viewBox="0 0 50 90"
        :width="width"
        :height="height"
        class="facebook-icon"
    >
        <path d="M50,15.646H35.717c-1.688,0-3.574,2.221-3.574,5.192v10.314H50v14.7H32.143V90H15.285V45.854H0v-14.7h15.285V22.5  c0-12.407,8.611-22.5,20.432-22.5H50V15.646z"/>
    </svg>
</template>

<script>
    export default {
        name: 'FacebookIcon',
        props: {
            width: {
                type: [Number, String],
                default: 10
            },
            height: {
                type: [Number, String],
                default: 14
            }
        }
    }
</script>
