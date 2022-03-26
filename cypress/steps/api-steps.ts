import { ClientList } from "models/Client";

const getParams = (params: Record<string, any>) => {
  return new URLSearchParams({ params: JSON.stringify(params) }).toString();
};
export const fixtureUserMe = (delay?: number) => {
  localStorage["userSlice.bearerToken"] = "testing";
  cy.intercept(
    {
      method: "GET",
      pathname: "**/me",
    },
    {
      statusCode: 200,
      fixture: "user/me.json",
      delay,
    }
  ).as("UserMe");
};

export const fixtureClientAll = (delay?: number) => {
  cy.intercept("GET", "**/clients?" + getParams({ limit: 9999999 }) + "**", {
    statusCode: 200,
    fixture: "client/all-clients.json",
    delay,
  }).as("ClientAll");
};

// pages without sorting nor filtering
export const fixtureInvoicesPage = (p: number, delay?: number) => {
  cy.intercept("GET", "**/invoices?" + getParams({ limit: 20 }) + "**", {
    statusCode: 200,
    fixture: `invoice/invoice-p${p}.json`,
    delay,
  }).as(`InvoicePage${p}`);
};

type ListingParams = {
  filter: Record<string, string>;
  sort: Record<string, string>;
  limit: number;
  offset: number;
};
const sortModifier = (sort: Record<string, string>) =>
  Object.entries(sort)
    .filter(([filter]) => filter !== "creation")
    .map(([filter, direction]) => filter + "-" + direction)
    .join("-");

// pages without sorting nor filtering
type FixtureClientsPageParameters =
  | {
      p?: number;
      delay?: number;
      sort?: Record<string, string>;
      fixture?: string;
    }
  | undefined;
export const fixtureClientsPage = ({
  p = 1,
  delay,
  sort,
  fixture,
}: FixtureClientsPageParameters = {}) => {
  let sm = sortModifier(sort || {});
  cy.intercept(
    {
      method: "GET",
      pathname: "**/clients",
    },
    async req => {
      let matches: boolean;
      if (!req.query.params) return;
      const params = JSON.parse(req.query.params as string) as ListingParams;

      // check that is correct page
      matches = params.offset == (p - 1) * 5;

      // check that sorting is the same
      const reqSm = sortModifier(params.sort);
      matches = sm === reqSm;

      if (matches) {
        const modifier = sm ? "-" + sm : "";
        req.reply({
          fixture: fixture ? fixture : `client/client${modifier}-p${p}.json`,
          delay,
        });
      }
    }
  ).as(`ClientPage${p}`);
};

export type FixtureClients = {
  clients: ClientList;
  total: number;
};

export const getFixtureClientAll = () =>
  cy.fixture<FixtureClients>("client/all-clients.json");

export const interceptClientAll = () =>
  cy
    .intercept({
      method: "GET",
      pathname: "/clients",
    })
    .as("ClientAll");

export const responseClientAll = () =>
  new Promise<FixtureClients>((resolve, reject) => {
    cy.wait("@ClientAll").then(interception => {
      if (interception.response) {
        resolve(interception.response.body);
      } else {
        reject();
      }
    });
  });
