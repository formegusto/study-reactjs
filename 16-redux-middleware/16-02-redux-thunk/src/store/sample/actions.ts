import { Dispatch } from "react";
import { Action } from "redux";
import {
  GET_POST,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
  GET_USERS,
  GET_USERS_SUCCESS,
  Post,
  Users,
} from "./types";
import * as api from "../../lib/api";

export interface SampleAction<DT = any> extends Action {
  payload?: DT;
  error?: boolean;
}

export const getPost =
  (id: number) => async (dispatch: Dispatch<SampleAction<Post>>) => {
    console.log("hi im getpost");
    dispatch({ type: GET_POST });
    try {
      const response = await api.getPost(id);
      dispatch({
        type: GET_POST_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({ type: GET_POST_FAILURE, payload: e, error: true });
      throw e; // 나중에 컴포넌트단에서 에러를 조회할 수 있게 해 줌
    }
  };
export const getUsers =
  () => async (dispatch: Dispatch<SampleAction<Users[]>>) => {
    dispatch({ type: GET_USERS });
    try {
      const response = await api.getUsers();
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: GET_POST_FAILURE,
        payload: e,
        error: true,
      });
      throw e;
    }
  };
