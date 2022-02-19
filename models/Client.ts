import { CompanyDetails } from "./CompanyDetails";

export type Client = {
  id: number | string;
  user_id?: string;
  name: string;
  email: string;
  companyDetails: CompanyDetails;
};

export interface ClientWithTotals extends Client {
  totalBilled: number;
}

export type ClientN = null | Client;
export type ClientList = Client[];
export type ClientListN = null | ClientList;
