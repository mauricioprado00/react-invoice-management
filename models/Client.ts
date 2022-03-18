import PropTypes from 'prop-types'

import { CompanyDetails, CompanyDetailsPropType } from "./CompanyDetails";

// typescript types

export type Client = {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  avatar?: string | null;
  companyDetails: CompanyDetails;
};

export interface ClientWithTotals extends Client {
  totalBilled: number;
  invoicesCount: number;
}

export type AnyClient = Client & {
  totalBilled?: number;
  invoicesCount?: number;
};

export type ClientN = null | Client;
export type ClientList = Client[];
export type ClientListN = null | ClientList;
export type ClientWithTotalsList = ClientWithTotals[]

// React PropTypes definitions for components

export const ClientPropTypes = {
  id: PropTypes.string.isRequired,
  user_id: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  companyDetails: PropTypes.exact(CompanyDetailsPropType).isRequired,
  totalBilled: PropTypes.number,
  invoicesCount: PropTypes.number,
}

export const ClientWithTotalsPropTypes = Object.assign({...ClientPropTypes} , {
  totalBilled: PropTypes.number.isRequired,
  invoicesCount: PropTypes.number.isRequired,
})

export const AnyClientPropTypes = Object.assign({...ClientPropTypes} , {
  totalBilled: PropTypes.number,
  invoicesCount: PropTypes.number,
})