import { first, last, split } from 'lodash';

export const getUserInitials = (fullname: string) => {
    if (!fullname) return;

    const names = split(fullname.toUpperCase(), ' ');

    const firstName = first(names);
    const firstInitial = getFirstLetter(firstName);

    let lastName,
        lastInitial = '';

    if (names.length > 1) {
        lastName = last(names);
        lastInitial = getFirstLetter(lastName);
    }

    return `${firstInitial}${lastInitial}`;
};

const getFirstLetter = (string = '') => {
    return split(string, '')[0];
};
