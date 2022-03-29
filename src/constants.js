export const BUSINESS_SITE_DOMAIN = 'https://retrevcard.com';
export const BUSINESS_SITE_DOMAIN_FORM = 'https://retrevcard.com/pages/contact';

export const PHONE_TYPE = {
    CELL: 'cell',
    WORK: 'work'
};

export const EMAIL_TYPE = {
    PREF: 'pref',
    WORK: 'work'
};

export const LINKS_TYPES = {
    BUSINESS: 'business',
    COMMON: 'common',
    TWITTER: 'twitter',
    FACEBOOK: 'facebook',
    INSTAGRAM: 'instagram',
    LINKEDIN: 'linkedin',
    PAYPAL: 'paypal',
    VENMO: 'venmo',
    TIKTOK: 'tiktok',
    ZELLE: 'zelle'
};

export const LINKS_DOMAINS = {
    TWITTER: {
        TYPE: 'twitter',
        DOMAIN: 'https://twitter.com/'
    },
    FACEBOOK: {
        TYPE: 'facebook',
        DOMAIN: 'https://www.facebook.com/'
    },
    INSTAGRAM: {
        TYPE: 'instagram',
        DOMAIN: 'https://www.instagram.com/'
    },
    LINKEDIN: {
        TYPE: 'linkedin',
        DOMAIN: 'https://www.linkedin.com/'
    },
    PAYPAL: {
        TYPE: 'paypal',
        DOMAIN: 'https://www.paypal.me/'
    },
    VENMO: {
        TYPE: 'venmo',
        DOMAIN: 'https://venmo.com/'
    },
    TIKTOK: {
        TYPE: 'tiktok',
        DOMAIN: 'https://www.tiktok.com/'
    },
    ZELLE: {
        TYPE: 'zelle',
        DOMAIN: 'https://www.zellepay.com/'
    }
};

// screen size (CSS)
export const SCREEN_SIZES = {
    NOT_SUPPORT: 'not support', // <= 319
    MOBILE: 'mobile', // <= 767
    TABLET: 'tablet', // > 767 && <= 900
    NETBOOK: 'netbook', // > 900 && <= 1165
    DESKTOP: 'desktop' // > 1165
};

export const MAX_SIZE_FILES = {
    AVATAR_PHOTO: 1024 * 1024 * 5
};

export const BASE_ANALYTICS_TITLES = {
    LAST_DAY: '24 hours',
    LAST_WEEK: '7 days',
    TOTAL: 'All time'
};

export const ACTION_TYPES = {
    VIEW: 'view',
    CLICK: 'click',
    DOWNLOAD: 'download',
    CONTACT: 'contact',
    DEVICE: 'device'
};

export const ACTION_ENTITY_TYPES = {
    CARD: 'card',
    LINK: 'link'
};

export const STRIPE_PRODUCT_TYPE = {
    INDIVIDUAL: 'individual',
    BUSINESS: 'business'
};

export const USER_ROLES = {
    ADMIN: 'admin',
    INDIVIDUAL: 'individual',
    INDIVIDUAL_PAID: 'individual-paid',
    BUSINESS: 'business',
    BUSINESS_PAID: 'business-paid'
};

export const ROLES_NAMING = {
    ADMIN: 'Super Admin',
    INDIVIDUAL: 'Free',
    INDIVIDUAL_PAID: 'Pro Individual',
    BUSINESS_PAID: 'Business'
}

export const ADVANCED_ANALYTICS_METRICS = {
    TAPS: {
        SLAG: 'taps',
        TITLE: 'Taps'
    },
    CONTACTS: {
        SLAG: 'contacts',
        TITLE: 'New contacts'
    },
    DOWNLOAD: {
        SLAG: 'download',
        TITLE: 'vCards downloaded'
    },
    DEVICE: {
        SLAG: 'unique-device',
        TITLE: 'Unique devices'
    },
    LINKS: {
        SLAG: 'visited-links',
        TITLE: 'Visited Social Media + Business links'
    }
};

export const DATE_FILTERS_OPTIONS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    CUSTOM: 'custom range'
}

export const MEGABYTE_SIZE = 1048576;
export const ZIP_TYPE = 'application/zip';
export const PDF_TYPE = 'application/pdf';
export const IMAGE_TYPE = /image.*/;
export const VIDEO_TYPE = /video.*/;

export const CONTENT_TYPES = {
    PHOTO: 'photo',
    LINK: 'link',
    VIDEO: 'video',
    DOCUMENT: 'document'
};
