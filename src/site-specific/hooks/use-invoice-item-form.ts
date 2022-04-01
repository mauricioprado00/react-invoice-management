import useForm, { UseFormReturn } from "hooks/use-form";
import { useMemo } from "react";

const elements = ["detail", "quantity", "rate"];

export type useInvoiceItemFormArgs = {
  item: InvoiceItem;
};

type InvoiceItemFieldsMapType<T> = {
  detail: T;
  quantity: T;
  rate: T;
};

export type UseInvoiceItemFormReturn = UseFormReturn & {
  state: {
    values: InvoiceItemFieldsMapType<string>;
    valid: InvoiceItemFieldsMapType<boolean>;
    disabled: InvoiceItemFieldsMapType<boolean>;
  };
};

export type InvoiceItem = {
  id: number;
  detail: string;
  quantity: number;
  rate: number;
  valid: boolean;
};

export const useInvoiceItemForm = ({ item }: useInvoiceItemFormArgs) => {
  const formProps = useMemo(() => {
    return {
      elements,
      disabled: false,
      initialValues: {
        detail: item.detail,
        quantity: item.quantity.toString(),
        rate: item.rate.toString(),
      },
    };
  }, [item]);

  return useForm(formProps) as UseInvoiceItemFormReturn;
};
