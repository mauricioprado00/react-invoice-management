enum Messages {
  Email = "Please enter valid email address",
  RegExp = "Please provide a valid %",
  Number = "Please enter valid number",
}

export type Validator = (value: string, extra?: any) => string | null;
export type ValidatorCreator = (message: string | null) => Validator;

export const emailValidator: ValidatorCreator =
  (message: string | null) => (value: string) => {
    return !/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)? message || Messages.Email : null;
  };

export const regexpValidator =
  (re: RegExp, message: string | null): Validator =>
  (value: string) => {
    return re.test(value) ? null : message || Messages.RegExp;
  };

export const numberValidator: ValidatorCreator =
  (message: string | null) => (value: string) => {
    return !/^[0-9]+$/.test(value) ? message || Messages.Email : null;
  };

export const gtValidator =
  (ref: number, message: string|null) => (value: string) => {
    const float: number = parseFloat(value);
    return float !== NaN && float <= ref
      ? message || "Must be higher than " + ref
      : null;
  };

export const minLengthValidator = (length: number) => (value: string) => {
  return value.length < length
    ? "Must be contain at least " + length + " characters."
    : null;
};

export const hasAlphaValidator = () => (value: string) => {
  return regexpValidator(
    /[a-z]/i,
    "Must contain an aphabetic character."
  )(value);
};

export const hasAlphaLowercaseValidator = () => (value: string) => {
  return regexpValidator(/[a-z]/, "Must contain an lowercase letter.")(value);
};

export const hasAlphaUppercaseValidator = () => (value: string) => {
  return regexpValidator(/[A-Z]/, "Must contain an uppercase letter.")(value);
};

export const hasNumberValidator = () => (value: string) => {
  return regexpValidator(/[0-9]/, "Must contain a number.")(value);
};

export const hasSymbolValidator = () => (value: string) => {
  return regexpValidator(/[^0-9a-z]/i, "Must contain a symbol.")(value);
};

export const passwordValidator =
  () =>
  (value: string): string | null => {
    const validators = [
      hasAlphaValidator(),
      hasAlphaLowercaseValidator(),
      hasAlphaUppercaseValidator(),
      hasNumberValidator(),
      hasSymbolValidator(),
      minLengthValidator(8),
    ];

    return validators.reduce(
      (result: null | string, validator) => result || validator(value),
      null
    );
  };

export const confirmPasswordValidator: ValidatorCreator =
  (message: string | null) => (value: string, compare: string) => {
    return value !== compare ? message : null;
  };

export const validationMessage = (label: string, message: string) => {
  return message.split("%").join(label);
};

export const ibanValidator = () => (value: string) => {
  return regexpValidator(
    /^[A-Z]{2}(?:[ ]?[0-9]){18,20}$/,
    "Must be a valid iban. e.g. DE89370400440532013000"
  )(value);
};

export const swiftValidator = () => (value: string) => {
  return regexpValidator(
    /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    "Must be a valid swift code. e.g. CTCBIDJASBY"
  )(value);
};

export const emptyOr =
  (validator: Validator) => (value: string, extra?: any) => {
    if (value.trim() === "") return null;
    return validator(value, extra);
  };

export const notBothEmpty: ValidatorCreator =
  (message: string | null) => (value: string, compare: string) => {
    return value.trim() === "" && compare.trim() === "" ? message : null;
  };
