import { takeLatest } from "@redux-saga/core/effects";
import { GET_POST, GET_USERS, Post, User } from "./types";
import * as api from "../../lib/api";
import createRequestSaga from "../../lib/createRequestSaga";

const getPostSaga = createRequestSaga<number, Post>(GET_POST, api.getPost);
const getUsersSaga = createRequestSaga<{}, User[]>(GET_USERS, api.getUsers);
/*
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
*/
export default function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}
