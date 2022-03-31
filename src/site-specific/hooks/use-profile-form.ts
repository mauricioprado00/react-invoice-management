import useForm, { UseFormReturn } from "hooks/use-form";
import { MapType } from "models/UtilityModels";

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

export type useProfileFormArgs = {
  disabled?: boolean;
  withBank?: boolean;
  disabledFields?: string[];
  initialValues?: Partial<ProfileFieldsMapType<string>>;
};

type ProfileFieldsMapType<T> = {
  name: T;
  email: T;
  companyName: T;
  avatar: T;
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
  initialValues,
}: useProfileFormArgs) =>
  useForm({
    elements: withBank ? elements_bank : elements,
    disabled,
    disabledFields,
    initialValues,
  }) as UseProfileFormReturn;
