import PropTypes from "prop-types";

// typescript types

export type CompanyDetails = {
  name: string;
  vatNumber: string;
  regNumber: string;
  address: string;
  iban?: string | null;
  swift?: string | null;
};
export type CompanyDetailsN = null | CompanyDetails;
export type CompanyDetailsList = CompanyDetails[];
export type CompanyDetailsListN = null | CompanyDetailsList;

// React PropTypes definitions for components

export const CompanyDetailsPropType = {
  name: PropTypes.string.isRequired,
  vatNumber: PropTypes.string.isRequired,
  regNumber: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export const CompanyDetailsFullPropType = {
  name: PropTypes.string.isRequired,
  vatNumber: PropTypes.string.isRequired,
  regNumber: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  iban: PropTypes.string,
  swift: PropTypes.string,
};
