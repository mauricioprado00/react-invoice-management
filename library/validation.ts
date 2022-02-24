
enum Messages {
    Email = "Please enter valid email address",
    RegExp = "Pleae provide a valid %",
    Number = "Please enter valid number",
}

export type Validator = (value:string) => string | null
export type ValidatorCreator = (message:string|null) => Validator

export const emailValidator:ValidatorCreator = (message:string|null) => (value:string) => {
    return value.indexOf('@') === -1 ? message || Messages.Email : null;
}

export const regexpValidator = (re:RegExp, message:string|null):Validator => (value:string) => {
    return re.test(value) ? null : message || Messages.RegExp;
}

export const numberValidator:ValidatorCreator = (message:string|null) => (value:string) => {
    return !/^[0-9]+$/.test(value) ? message || Messages.Email : null;
}


export const validationMessage = (label:string, message:string) => {
    return message.split('%').join(label);
}