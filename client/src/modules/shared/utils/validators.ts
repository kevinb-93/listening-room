enum ValidatorTypes {
    Require,
    MinLength,
    MaxLength,
    Min,
    Max,
    Email,
    File,
}

export const VALIDATOR_REQUIRE = () => ({ type: ValidatorTypes.Require });
export const VALIDATOR_FILE = () => ({ type: ValidatorTypes.File });
export const VALIDATOR_MINLENGTH = (val: number) => ({
    type: ValidatorTypes.MinLength,
    val,
});
export const VALIDATOR_MAXLENGTH = (val: number) => ({
    type: ValidatorTypes.MaxLength,
    val,
});
export const VALIDATOR_MIN = (val: number) => ({
    type: ValidatorTypes.Min,
    val,
});
export const VALIDATOR_MAX = (val: number) => ({
    type: ValidatorTypes.Max,
    val,
});
export const VALIDATOR_EMAIL = () => ({ type: ValidatorTypes.Email });

export interface Validator {
    type: ValidatorTypes;
    val?: number;
}

export const validate = (value: string, validators: Validator[]) => {
    let isValid = true;
    for (const validator of validators) {
        if (validator.type === ValidatorTypes.Require) {
            isValid = isValid && value.trim().length > 0;
        }
        if (validator.type === ValidatorTypes.MinLength) {
            isValid = isValid && value.trim().length >= validator.val;
        }
        if (validator.type === ValidatorTypes.MaxLength) {
            isValid = isValid && value.trim().length <= validator.val;
        }
        if (validator.type === ValidatorTypes.Min) {
            isValid = isValid && +value >= validator.val;
        }
        if (validator.type === ValidatorTypes.Max) {
            isValid = isValid && +value <= validator.val;
        }
        if (validator.type === ValidatorTypes.Email) {
            isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
        }
    }
    return isValid;
};
