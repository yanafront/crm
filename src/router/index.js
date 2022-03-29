import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';
import { checkPermission } from '@/components/RoleManagment/checkPermission';
import { USER_ROLES } from '@/constants';

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters['auth/isAuth']) {
        next();
        return;
    }

    next('/');
};

const ifAuthenticated = (to, from, next) => {
    if (store.getters['auth/isAuth']) {
        next();
        return;
    }

    next('/auth');
};

const bindTagsToCard = (to, from, next) => {
    if (to?.query?.tag) {
        if (store.getters['auth/isAuth']) {
            store.commit('tags/BIND_TAG_FOR_AUTHENTICATED_USER', true);
        }

        next();
    } else {
        ifNotAuthenticated(to, from, next);
    }
};

const routes = [
    {
        path: '/auth',
        name: 'PreAuth',
        component: () => import(/* webpackChunkName: "PreAuth" */ '@/views/Auth/PreAuthPage.vue'),
        meta: {
            layout: 'auth',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/auth/signup',
        name: 'SignUp',
        component: () => import(/* webpackChunkName: "signup" */ '@/views/Auth/SignUp.vue'),
        meta: {
            layout: 'auth',
        },
        beforeEnter: [bindTagsToCard]
    },
    {
        path: '/auth/signup/success',
        name: 'SignUpSuccess',
        component: () => import(/* webpackChunkName: "signupSuccess" */ '@/views/Auth/SignUpSuccess.vue'),
        meta: {
            layout: 'service',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Auth/Login.vue'),
        meta: {
            layout: 'auth',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/auth/login/unverified_email',
        name: 'UnverifiedEmail',
        component: () => import(/* webpackChunkName: "unverifiedEmail" */ '@/views/Auth/UnverifiedEmail.vue'),
        meta: {
            layout: 'service',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/auth/forgot-password',
        name: 'ForgotPassword',
        component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/Auth/ForgotPassword.vue'),
        meta: {
            layout: 'auth',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/password/reset',
        name: 'ResetPassword',
        component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/Auth/ResetPassword.vue'),
        meta: {
            layout: 'auth',
        },
        beforeEnter: ifNotAuthenticated
    },
    {
        path: '/',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile/Profile.vue'),
        meta: {
            layout: 'main',
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/profile-settings',
        name: 'ProfileSettings',
        component: () => import(/* webpackChunkName: "profileSettings" */ '@/views/Profile/ProfileSettings.vue'),
        meta: {
            layout: 'main'
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/edit-profile',
        name: 'EditProfile',
        component: () => import(/* webpackChunkName: "editProfile" */ '@/views/Profile/EditProfile.vue'),
        meta: {
            layout: 'main',
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/:unique_link',
        name: 'PublicProfile',
        component: () => import(/* webpackChunkName: "publicProfile" */ '@/views/PublicProfile/PublicProfile.vue'),
        meta: {
            layout: 'public',
        },
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: () => import(/* webpackChunkName: "contacts" */ '@/views/Contacts/Contacts.vue'),
        meta: {
            layout: 'main',
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import(/* webpackChunkName: "analytics" */ '@/views/Analytics/Analytics.vue'),
        meta: {
            layout: 'main',
        },
        children: [
            {
                path: 'metric/:metric',
                name: 'AnalyticMetric',
                props: true,
                component: () => import(/* webpackChunkName: "analyticMetric" */ '@/views/Analytics/SingleAnalyticMetric.vue'),
                meta: {
                    permission: {
                        roles: [
                            USER_ROLES.INDIVIDUAL_PAID,
                            USER_ROLES.BUSINESS_PAID,
                            USER_ROLES.ADMIN
                        ],
                        noAccessRedirect: '/security/role/forbidden',
                    },
                },
            },
        ],
        beforeEnter: ifAuthenticated
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import(/* webpackChunkName: "products" */ '@/views/Stripe/Products.vue'),
        meta: {
            layout: 'main',
        },
        children: [
            {
                path: 'payment',
                name: 'Payment',
                component: () => import(/* webpackChunkName: "addPaymentMethod" */ '@/views/Stripe/AddPaymentMethod.vue'),
            },
        ],
        beforeEnter: ifAuthenticated
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "usersManagment" */ '@/views/AdminManagment/Users.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN,
                    USER_ROLES.BUSINESS,
                    USER_ROLES.BUSINESS_PAID
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/users/:user',
        name: 'EditUser',
        component: () => import(/* webpackChunkName: "usersManagment" */ '@/views/AdminManagment/EditUser.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN,
                    USER_ROLES.BUSINESS_PAID
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/business-users',
        name: 'BusinessUsersList',
        component: () => import(/* webpackChunkName: "businessUsersList" */ '@/views/AdminManagment/BusinessUsersList.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/add-new-user',
        name: 'AddNewUser',
        component: () => import(/* webpackChunkName: "addNewUser" */ '@/views/AdminManagment/AddNewUser.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/add-new-business',
        name: 'AddNewBusiness',
        component: () => import(/* webpackChunkName: "addNewBusiness" */ '@/views/AdminManagment/AddNewBusiness.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/add-user-to-business',
        name: 'AddUsersToExistingBusiness',
        component: () => import(/* webpackChunkName: "addUsersToExistingBusinesss" */ '@/views/AdminManagment/AddUsersToExistingBusiness.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    {
        path: '/tags',
        name: 'Tags',
        component: () => import(/* webpackChunkName: "tags" */ '@/views/Tags/Tags.vue'),
        meta: {
            layout: 'main',
            permission: {
                roles: [
                    USER_ROLES.ADMIN
                ],
                noAccessRedirect: '/security/role/forbidden',
            },
        },
        beforeEnter: ifAuthenticated
    },
    // {
    //     path: '/tag/create',
    //     name: 'CreateEditTag',
    //     component: () => import(/* webpackChunkName: "createEditTag" */ '@/views/Tags/CreateEditTag.vue'),
    //     meta: {
    //         layout: 'main',
    //         permission: {
    //             roles: [
    //                 USER_ROLES.ADMIN
    //             ],
    //             noAccessRedirect: '/security/role/forbidden',
    //         },
    //     },
    //     beforeEnter: ifAuthenticated
    // },
    // service page
    {
        path: '/style-guide',
        name: 'StyleGuide',
        component: () => import(/* webpackChunkName: "styleGuide" */ '@/views/StyleGuide.vue'),
        meta: {
            layout: 'main',
        },
        beforeEnter: ifAuthenticated
    },
    // Page for 404 error
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "notFound" */ '@/views/404.vue'),
        meta: {
            layout: 'service',
        }
    },
    // Not access page
    {
        path: '/security/role/forbidden',
        name: 'HasNotAccess',
        component: () => import(/* webpackChunkName: "hasNotAccess" */ '@/components/RoleManagment/HasNotAccessToRoute.vue'),
        meta: {
            layout: 'service',
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    }
});

router.beforeEach(async (to, from, next) => {
    const getUserIfNotReceived = () => {
        const userRole   = store.getters['user/getUserRole'];
        const isAuth = store.getters['auth/isAuth'];

        if (!userRole && isAuth) {
            return store.dispatch('user/GET_AUTH_USER_INFO').then();
        }
    }

    await getUserIfNotReceived();

    // If there are no permissions to check then proceed
    if (!to.meta.permission) return next();

    const { roles = [], config = {} } = to.meta.permission;
    if (!roles.length) return next();
    const hasAccess = checkPermission(roles, config);

    if (hasAccess) {
      return next();
    }
    // No access!
    next(to.meta.permission?.noAccessRedirect || '/security/role/forbidden');
  })

export default router
