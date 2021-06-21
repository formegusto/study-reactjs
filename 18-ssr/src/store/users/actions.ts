import { Dispatch } from "react";
import {
  GET_USER,
  GET_USERS_FAILURE,
  GET_USERS_PENDING,
  GET_USERS_SUCCESS,
  User,
} from "./types";
import * as api from "../../api/users";
import { Action } from "redux";
import { createAction } from "redux-actions";

interface Payload extends Action {
  payload?: User[];
}

export const getUsers = () => async (dispatch: Dispatch<Payload>) => {
  dispatch({ type: GET_USERS_PENDING });
  try {
    const response = await api.getUsers();
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  } catch (e) {
    dispatch({ type: GET_USERS_FAILURE, payload: e });
    throw e;
  }
};

export const getUser = createAction(GET_USER);
