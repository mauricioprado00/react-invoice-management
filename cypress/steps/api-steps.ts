import {
  GenericStaticResponse,
  RouteHandler,
} from "cypress/types/net-stubbing";
import { ClientList } from "models/Client";

type FixturePaginationParameters =
  | {
      p?: number;
      delay?: number;
      sort?: Record<string, string>;
      fixture?: string;
      reply?: GenericStaticResponse<
        string,
        string | boolean | object | ArrayBuffer | null
      >;
    }
  | undefined;

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

export const paginationRouterHandler = (
  fixtureBaseName: string,
  { p = 1, delay, sort, fixture, reply }: FixturePaginationParameters = {}
): RouteHandler => {
  let sm = sortModifier(sort || {});
  return async req => {
    let matches: boolean;
    if (!req.query.params) return;
    const params = JSON.parse(req.query.params as string) as ListingParams;

    // check that is correct page
    matches = params.offset == (p - 1) * 5;

    // check that sorting is the same
    const reqSm = sortModifier(params.sort);
    matches = matches && sm === reqSm;

    if (matches) {
      const modifier = sm ? "-" + sm : "";

      req.reply(
        reply
          ? reply
          : {
              fixture: fixture
                ? fixture
                : `${fixtureBaseName}${modifier}-p${p}.json`,
              delay,
            }
      );
    }
  };
};

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

export const fixtureInvoicesPage = (
  params: FixturePaginationParameters = {}
) => {
  const { p } = params;
  cy.intercept(
    {
      method: "GET",
      pathname: "**/invoices",
    },
    paginationRouterHandler("invoice/invoice", params)
  ).as(`InvoicePage${p}`);
};

export const fixtureClientsPage = (
  params: FixturePaginationParameters = {}
) => {
  const { p } = params;
  cy.intercept(
    {
      method: "GET",
      pathname: "**/clients",
    },
    paginationRouterHandler("client/client", params)
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
