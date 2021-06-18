export const GET_USERS_PENDING = "users/GET_USERS_PENDING";
export const GET_USERS_SUCCESS = "users/GET_USERS_SUCCESS";
export const GET_USERS_FAILURE = "users/GET_USERS_FAILURE";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
