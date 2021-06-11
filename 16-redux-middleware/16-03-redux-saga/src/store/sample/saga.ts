import { call, put, takeLatest } from "@redux-saga/core/effects";
import { finishLoading, startLoading } from "../loading/actions";
import {
  GET_POST,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
  GET_USERS,
  GET_USERS_FAILURE,
  GET_USERS_SUCCESS,
  Post,
  User,
} from "./types";
import * as api from "../../lib/api";
import { getPost, getUsers } from "./actions";
import { Action } from "redux";
import { AxiosResponse } from "axios";

interface PostPayload extends Action {
  payload: Post;
  error?: boolean;
}

interface UsersPayload extends Action {
  payload: User[];
  error?: boolean;
}

function* getPostSaga(action: ReturnType<typeof getPost>) {
  yield put<Action>(startLoading(GET_POST));
  try {
    const post: AxiosResponse<Post> = yield call(api.getPost, action.payload);
    yield put<PostPayload>({
      type: GET_POST_SUCCESS,
      payload: post.data,
    });
  } catch (e) {
    yield put<PostPayload>({
      type: GET_POST_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put<Action>(finishLoading(GET_POST));
}

function* getUsersSaga(action: ReturnType<typeof getUsers>) {
  yield put<Action>(startLoading(GET_USERS));
  try {
    const users: AxiosResponse<User[]> = yield call(api.getUsers);
    yield put<UsersPayload>({
      type: GET_USERS_SUCCESS,
      payload: users.data,
    });
  } catch (e) {
    yield put<UsersPayload>({
      type: GET_USERS_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put<Action>(finishLoading(GET_USERS));
}

export default function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}
