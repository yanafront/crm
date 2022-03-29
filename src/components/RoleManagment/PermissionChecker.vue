<template>
    <slot v-if="hasAccess" />
    <slot v-else name="no-access" />
</template>

<script>
import { checkPermission } from "./checkPermission";
import { mapGetters } from 'vuex';

// re-export for easier access
export { checkPermission };

export default {
    name: 'PermissionChecker',
    props: {
        roles: {
            type: Array,
            required: true,
        },
        type: {
            type: String,
            default: "one-of",
            validator: value => ["one-of", "all-of"].includes(value),
        },
        entityOwnerId: {
            type: [String, Number],
        },
        debug: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            hasAccess: null
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
        }),
    },
    watch: {
        userRole: {
            deep: true,
            handler: function() {
                this.hasAccess = null;
                this.checkAccess();
            }
        }
    },
    methods: {
        checkAccess() {
            this.hasAccess = checkPermission(this.roles, {
                type: this.type,
                entityOwnerId: this.entityOwnerId,
                debug: this.debug,
            });
        }
    },
    created() {
        this.checkAccess();
    }
}
</script>
