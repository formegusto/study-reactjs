import { call, put, takeLatest } from "@redux-saga/core/effects";
import { finishLoading, startLoading } from "../loading/actions";
import {
  GET_POST,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
  GET_USERS,
  GET_USERS_FAILURE,
  GET_USERS_SUCCESS,
} from "./types";
import * as api from "../../lib/api";
import { getPost, getUsers } from "./actions";

function* getPostSaga(
  action: ReturnType<typeof getPost>
): Generator<any, any, any> {
  yield put(startLoading(GET_POST));
  try {
    const post = yield call(api.getPost, action.payload);
    yield put({
      type: GET_POST_SUCCESS,
      payload: post.data,
    });
  } catch (e) {
    yield put({
      type: GET_POST_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put(finishLoading(GET_POST));
}

function* getUsersSaga(
  action: ReturnType<typeof getUsers>
): Generator<any, any, any> {
  yield put(startLoading(GET_USERS));
  try {
    const users = yield call(api.getUsers);
    yield put({
      type: GET_USERS_SUCCESS,
      payload: users.data,
    });
  } catch (e) {
    yield put({
      type: GET_USERS_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield finishLoading(GET_USERS);
}

export default function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}
