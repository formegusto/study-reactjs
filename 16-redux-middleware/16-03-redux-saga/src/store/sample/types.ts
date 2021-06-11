import createActionType from "../../lib/createActionType";

export const [GET_POST, GET_POST_SUCCESS, GET_POST_FAILURE] =
  createActionType("sample/GET_POST");
export const [GET_USERS, GET_USERS_SUCCESS, GET_USERS_FAILURE] =
  createActionType("sample/GET_USERS");

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

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
