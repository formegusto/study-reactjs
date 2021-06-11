import { createAction } from "redux-actions";
import { GET_POST, GET_USERS } from "./types";

export const getPost = createAction<number, number>(GET_POST, (id) => id);
export const getUsers = createAction(GET_USERS);
