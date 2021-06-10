export const GET_POST = "sample/GET_POST";
export const GET_POST_SUCCESS = "sample/GET_POST_SUCCSS";
export const GET_POST_FAILURE = "sample/GET_POST_FAILURE";

export const GET_USERS = "sample/GET_USERS";
export const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";
export const GET_USERS_FAILURE = "sample/GET_USERS_FAILURE";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Users {
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
