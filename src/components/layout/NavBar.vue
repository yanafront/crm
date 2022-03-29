<template>
    <div class="main-navigation">
        <!-- Mobile Navigation -->
        <div
            class="menu-toggle"
            @click="toggleMenu"
        >
            <arrow-shewron
                class="i-white"
                width="20"
                height="20"
                :transform="menuState ? '180' : '0'"
            />
        </div>
        <!-- End Mobile Navigation -->
        <a
            class="main-navigation_logo pointer"
            :href="BUSINESS_SITE_DOMAIN"
            target="_blank"
        >
            Retrēv
        </a>
        <nav class="main-navigation_menu">
            <ul>
                <li
                    v-for="(item, index) in availableMenu(menu)"
                    :key="index"
                >
                    <router-link
                        class="main-navigation_menu-item f-medium"
                        @click="closeMenu"
                        :to="{ name: item.link }"
                    >
                        <component
                            :is="item.icon"
                            class="mr-8"
                        />
                        {{ item.title }}
                    </router-link>
                </li>
            </ul>
        </nav>
        <pro-features
            @closeMenu="closeMenu"
            v-if="canViewProFeatures()"
        />
        <button
            class="row-start row-baseline transparent-button main-navigation_signout f-14-white f-medium"
            @click="logout"
        >
            <signout-icon class="mt-1 mr-8"/>
            Sign Out
        </button>
    </div>
</template>

<script>
import {
    WindowIcon, ContactsIcon, AnalyticsIcon, SignoutIcon,
    DashboardIcon, ArrowShewron, PersonalCardIcon
} from "@/icons";
import ProFeatures from './ProFeatures.vue';
import { checkPermission } from '@/components/RoleManagment/checkPermission';
import { USER_ROLES, BUSINESS_SITE_DOMAIN } from '@/constants';
import { mapGetters } from 'vuex';

export default {
    name: "NavBar",
    components: {
        WindowIcon,
        ContactsIcon,
        AnalyticsIcon,
        SignoutIcon,
        DashboardIcon,
        ArrowShewron,
        PersonalCardIcon,
        ProFeatures
    },
    data:() => {
        return {
            BUSINESS_SITE_DOMAIN,
            menu: [
                {
                    title: 'Page',
                    link: 'Profile',
                    icon: 'window-icon',
                    roles: []
                },
                {
                    title: 'Contacts',
                    link: 'Contacts',
                    icon: 'contacts-icon',
                    roles: []
                },
                {
                    title: 'Analytics',
                    link: 'Analytics',
                    icon: 'analytics-icon',
                    roles: []
                },
                {
                    title: 'Users',
                    link: 'Users',
                    icon: 'contacts-icon',
                    roles: [
                        USER_ROLES.ADMIN,
                        USER_ROLES.BUSINESS,
                        USER_ROLES.BUSINESS_PAID
                    ]
                },
                {
                    title: 'Tags',
                    link: 'Tags',
                    icon: 'personal-card-icon',
                    roles: [
                        USER_ROLES.ADMIN
                    ]
                }
            ],
            menuState: false
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole'
        }),
    },
    methods: {
        availableMenu(menu) {
            let menuForRender = [];

            menu.forEach(item => {
                if (!item.roles.length || checkPermission(item.roles)) {
                    if ((this.userRole === USER_ROLES.BUSINESS_PAID
                        || this.userRole === USER_ROLES.ADMIN)
                        && item.title === 'Analytics'
                    ) {
                        item.title = 'Dashboard';
                    }
                    menuForRender.push(item);
                }
            });
            return menuForRender;
        },
        logout() {
            this.$store.commit('auth/AUTH_LOGOUT', true);
            this.$store.commit('cards/REMOVE_CARD_INFO', []);
        },
        toggleMenu() {
            const navigation = document.querySelector('.main-navigation');
            if (navigation) {
                navigation.classList.toggle('show');
                this.menuState = !this.menuState;
            }
        },
        closeMenu() {
            const navigation = document.querySelector('.main-navigation');
            if (navigation) {
                navigation.classList.remove('show');
                this.menuState = !this.menuState;
            }
        },
        closeMenuOnOutsideClick(e) {
            const btnMenu = document.querySelector('.menu-toggle');
            const menu = document.querySelector('.main-navigation');
            const target = e.target;
            const its_menu = target == menu || menu.contains(target);
            const its_btnMenu = target == btnMenu;
            const menu_is_active = menu.classList.contains('show');

            if (!its_menu && !its_btnMenu && menu_is_active) {
                this.closeMenu();
            }
        },
        canViewProFeatures() {
            return this.userRole !== USER_ROLES.ADMIN
        }
    },
    mounted() {
        document.addEventListener('click', this.closeMenuOnOutsideClick);
    },
    unmounted() {
        document.removeEventListener('click', this.closeMenuOnOutsideClick);
    }
}
</script>
