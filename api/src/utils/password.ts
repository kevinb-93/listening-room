import bcyrpt from 'bcryptjs';

export const isPasswordValid = async (
    password: string,
    validPassword: string
) => {
    return bcyrpt.compare(password, validPassword);
};
