import useForm, { UseFormReturn } from "hooks/use-form";

const elements = [
  "name",
  "email",
  "companyName",
  "address",
  "regNumber",
  "vatNumber",
  //"avatar", NO because vhe state. Valid is not handled for the custom Avatar Selector
];

const elements_bank = elements.concat(["iban", "swift"]);

type useProfileFormArgs = {
  disabled?: boolean;
  withBank?: boolean;
  disabledFields?: string[];
};

type ProfileFieldsMapType<T> = {
  name: T;
  email: T;
  companyName: T;
  address: T;
  regNumber: T;
  vatNumber: T;
  iban?: T;
  swift?: T;
};

export type UseProfileFormReturn = UseFormReturn & {
  state: {
    values: ProfileFieldsMapType<string>;
    valid: ProfileFieldsMapType<boolean>;
    disabled: ProfileFieldsMapType<boolean>;
  };
};

export const useProfileForm = ({
  withBank,
  disabled = false,
  disabledFields,
}: useProfileFormArgs) =>
  useForm({
    elements: withBank ? elements_bank : elements,
    disabled,
    disabledFields,
  }) as UseProfileFormReturn;
