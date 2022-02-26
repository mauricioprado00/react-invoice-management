import PropTypes from 'prop-types'

import { CompanyDetails, CompanyDetailsPropType } from "./CompanyDetails";

// typescript types

export type Client = {
  id: number | string;
  user_id?: string;
  name: string;
  email: string;
  avatar?: string | null;
  companyDetails: CompanyDetails;
};

export interface ClientWithTotals extends Client {
  totalBilled: number;
}

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
  companyDetails: PropTypes.exact(CompanyDetailsPropType)
}

export const ClientWithTotalsPropTypes = Object.assign({...ClientPropTypes} , {
  totalBilled: PropTypes.number.isRequired,
})
