<template>
    <div :class="[darkModeActive ? 'dark-theme' : 'light-theme']">
        <component
            :is="currentLayoutComponent"
            v-if="currentLayoutComponent"
        >
            <router-view />
        </component>
    </div>
</template>

<script>
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import PublicProfileLayout from './layout/PublicProfileLayout.vue';
import ServiceLayout from './layout/ServiceLayout.vue';
import { mapGetters } from 'vuex';

const layoutComponents = {
    main: MainLayout,
    auth: AuthLayout,
    public: PublicProfileLayout,
    service: ServiceLayout
};

export default {
    name: 'App',
    computed: {
        ...mapGetters({
            userIsLoggedIn: 'auth/isAuth',
            isDarkMode: 'cards/darkModeIsActive',
            publicProfileIsDark: 'cards/publicProfileIsDark'
        }),
        currentLayoutComponent() {
            const layout = this.$router.currentRoute.value?.meta?.layout;
            return layoutComponents[layout];
        },
        darkModeActive() {
            if (this.$route.name === 'PublicProfile') {
                return this.publicProfileIsDark;
            }

            if (this.$route.name === 'EditUser') {
                return JSON.parse(localStorage.getItem('darkMode'));
            }

            return this.isDarkMode;
        }
    },
    methods: {
        checkScreenSize() {
            this.$store.commit('screen/SCREEN_SIZE', window.innerWidth);
        }
    },
    created() {
        this.$store.commit('setHostName', window.location.origin);
    },
    mounted() {
        // a full list of screen sizes is in constants
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
    }
}
</script>
