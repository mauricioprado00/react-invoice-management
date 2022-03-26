import moment, { isMoment } from "moment";

type FieldTypeOptions = (
  | {
      isDate: true;
      value?: number | undefined | null;
    }
  | {
      isDate?: false;
      value?: string | number | undefined | null;
    }
) & {
  name: string;
};

/**
 * conditionally type into a field if value is not null or undefined
 */
export const fieldType = (options: FieldTypeOptions) => {
  if (options.value !== undefined && options.value !== null && options.value !== '') {
    if (options.isDate) {
      cy.get('input[name="' + options.name + '"]')
        .click()
        .type(moment(options.value).format("YYYY-MM-DD"));
    } else {
      cy.get('input[name="' + options.name + '"]')
        .click()
        .type("{selectall}")
        .type(options.value.toString());
    }
  }
};

export const fieldValue = (name: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    cy.get('input[name="' + name + '"]')
      .invoke("val")
      .then(value => (value ? resolve(value.toString()) : resolve(undefined)));
  });
};

export const fieldDateValue = (name: string) => {
  return new Promise<number | undefined>((resolve, reject) => {
    cy.get('input[name="' + name + '"]')
      .invoke("val")
      .then(value => {
        if (value) {
          if (moment(value).isValid()) {
            resolve(moment(value).valueOf());
          } else {
            reject(value);
          }
        } else {
          resolve(undefined);
        }
      });
  });
};


export const fieldTextContent = (selector: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    cy.get(selector)
      .invoke("text")
      .then(value => (value ? resolve(value.toString()) : resolve(undefined)));
  });
};
