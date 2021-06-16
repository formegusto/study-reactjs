import { Dispatch } from "react";
import {
  GET_USERS_FAILURE,
  GET_USERS_PENDING,
  GET_USERS_SUCCESS,
} from "./types";
import * as api from "../../api/users";

export const getUsers = () => async (dispatch: Dispatch<any>) => {
  dispatch({ type: GET_USERS_PENDING });
  try {
    const response = await api.getUsers();
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  } catch (e) {
    dispatch({ type: GET_USERS_FAILURE, payload: e });
    throw e;
  }
};
