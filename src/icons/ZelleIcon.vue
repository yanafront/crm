<template>
    <svg
        viewBox="0 0 6 11"
        :width="width"
        :height="height"
        class="zelle-icon"
    >
       <path d="M2.28586 1.88487L0.139553 1.86538L0.13955 3.26973H3.69657L0 7.94283V9.13125H2.28586V10.5H3.65738V9.13124H5.98897C6.00856 9.07649 6.01543 8.92884 5.89134 8.79358C5.68562 8.56813 5.522 8.33252 5.37178 8.03622C5.30321 7.90418 5.25113 7.74603 5.23154 7.73315C4.77239 7.7124 2.13096 7.71777 2.13238 7.70129L5.83222 2.99953V1.88487H3.65738V0.5H2.28586V1.88487Z"/>
    </svg>
</template>
<script>
export default {
    name: 'ZelleIcon',
    props: {
        width: {
            type: [Number, String],
            default: 14
        },
        height: {
            type: [Number, String],
            default: 16
        }
    }
}
</script>
