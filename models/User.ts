import PropTypes from "prop-types";
import { Client } from "./Client";

import { CompanyDetails, CompanyDetailsPropType } from "./CompanyDetails";

// typescript types

export type User = {
  id: string;
  name: string;
  email: string;
};

export interface UserWithPassword extends User {
  password: string;
  confirmPassword: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
}

export type AnyUser = User & {
  password: string;
  confirmPassword: string;
};

export type LoginResponse = {
  user_id: string,
  email: string,
  name: string,
  token: string,
}

export type RegisterData = {
  user_id: string,
}

export type Me = Omit<Omit<Client, "user_id">, "companyDetails"> & {
  password: string,
  companyDetails?: CompanyDetails
}

export type MeFull = Me & {
  companyDetails: CompanyDetails & {
    iban?: string | null
    switft?: string | null
  }
}

export type UserN = null | User;
export type UserList = User[];
export type UserListN = null | UserList;
export type UserWithPasswordList = UserWithPassword[];

// React PropTypes definitions for components

export const UserPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export const UserWithPasswordPropTypes = Object.assign(
  { ...UserPropTypes },
  {
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }
);

export const LoginCredentialsPropTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export const AnyUserPropTypes = Object.assign(
  { ...UserPropTypes },
  {
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }
);

export const MePropTypes = Object.assign(
  {...UserPropTypes},
  {...LoginCredentialsPropTypes},
  {
    companyDetails: PropTypes.exact(CompanyDetailsPropType)
  }
)