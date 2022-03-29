export const removeEmptyFields = (obj) => {
    for (let propName in obj) {
        if (obj[propName] === null
            || obj[propName] === undefined
            || obj[propName] === ""
        ) {
            delete obj[propName];
        }
    }
};

export const capitalizeFirstLetter = (string) => {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

export const formatFileName = (name) => {
    if (name.length > 24) {
        return `${name.slice(0, 15)}...${name.substr(name.lastIndexOf('.') - 2)}`;
    } else {
        return name;
    };
};

export const fullName = (value) => {
    if (!value.first_name && !value.last_name) {
        return 'No information';
    }

    const firstName = value.first_name ? value.first_name : '';
    const lastName = value.last_name ? value.last_name : '';
    return `${firstName} ${lastName}`;
};

export const getTemporarilyLink = function(url) {
    return new Promise((resolve, reject) => {
        try {
            const link = document.createElement('a');
            link.href = url;
            link.click();
            link.remove();
            resolve();
        } catch(error) {
            reject(error);
        }
    });
};

export const getErrorsFields = function(error) {
    let errorsData = {};
    if (error?.response?.data?.meta?.error_description) {
        Object.keys(error.response.data.meta.error_description).forEach(key => {
            error.response.data.meta.error_description[key].forEach((item, index) => {
                errorsData[key] = error.response.data.meta.error_description[key][index];
            });
        });
    }

    return errorsData;
};

export const scrollToElementInBlock = (element) => {
    element.scrollIntoView();
};

export const getPrimaryCard = function(cardsArr) {
    if (!Array.isArray(cardsArr)) return cardsArr;
    return cardsArr.find(el => el.is_primary);
};
