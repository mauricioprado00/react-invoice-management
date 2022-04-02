import useForm, { UseFormReturn } from "hooks/use-form";
import { MapType, MapTypeFill } from "models/UtilityModels";
import moment from "moment";
import { useMemo } from "react";
import { ClientInvoice, PaymentType } from "site-specific/models/Invoice";

const elements = [
  "invoice_number",
  "date",
  "dueDate",
  //"value", not handled by useForm
  "payment",
  "client_id",
  "projectCode",
  "name",
  "address",
  "regNumber",
  "vatNumber",
];

export type useInvoiceFormArgs = {
  clientInvoice: ClientInvoice | null;
  disabled?: boolean;
  disabledFields?: string[];
  clientId?: string | null;
  paymentTypes: PaymentType[];
};

type InvoiceFieldsMapType<T> = {
  invoice_number: T;
  date: T;
  dueDate: T;
  payment: T;
  client_id: T;
  projectCode: T;
  name: T;
  address: T;
  regNumber: T;
  vatNumber: T;
};

export type UseInvoiceFormReturn = UseFormReturn & {
  state: {
    values: InvoiceFieldsMapType<string>;
    valid: InvoiceFieldsMapType<boolean>;
    disabled: InvoiceFieldsMapType<boolean>;
  };
};

export const useInvoiceForm = ({
  clientInvoice,
  disabled = false,
  disabledFields,
  clientId,
  paymentTypes,
}: useInvoiceFormArgs) => {
  const formProps = useMemo(() => {
    let initialValues: MapType<string> | undefined = undefined;

    if (clientInvoice) {
      // when invoice edition
      const c = clientInvoice.client.companyDetails;
      const b = clientInvoice.invoice.meta?.billTo;
      initialValues = {
        id: clientInvoice.invoice.id || "",
        invoice_number: clientInvoice.invoice.invoice_number.toString(),
        date: new Date(clientInvoice.invoice.date)
          .toISOString()
          .replace(/T.*/, ""),
        dueDate: new Date(clientInvoice.invoice.dueDate)
          .toISOString()
          .replace(/T.*/, ""),
        value: clientInvoice.invoice.value.toString(),
        client_id: clientInvoice.invoice.client_id,
        projectCode: clientInvoice.invoice.projectCode || "",
        name: b?.name || c?.name,
        address: b?.address || c?.address,
        vatNumber: b?.vatNumber || c?.vatNumber,
        regNumber: b?.regNumber || c?.regNumber,
        payment: clientInvoice.invoice.meta?.payTo.accountNumber || "",
      };
    } else {
      // when invoice creation
      initialValues = MapTypeFill(elements, "");
      initialValues = Object.assign(initialValues, {
        client_id: clientId || "",
        date: moment().format("YYYY-MM-DD"),
        dueDate: moment().add(15, "days").format("YYYY-MM-DD"),
      });

      // select the first payment type
      const [paymentType] = paymentTypes;
      initialValues.payment = paymentType.accountNumber;
    }

    return {
      elements,
      disabled,
      disabledFields,
      initialValues,
    };
  }, [clientInvoice, disabled, disabledFields, clientId, paymentTypes]);
  return useForm(formProps) as UseInvoiceFormReturn;
};
