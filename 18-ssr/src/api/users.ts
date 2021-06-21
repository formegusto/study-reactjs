import axios, { AxiosResponse } from "axios";
import { User } from "../store/users/types";

export const getUsers = () =>
  axios.get("https://jsonplaceholder.typicode.com/users");

export const getUserById = (id: number) =>
  axios.get<any, AxiosResponse<User>>(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
