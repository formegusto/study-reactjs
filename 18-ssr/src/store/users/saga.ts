import { AxiosResponse } from "axios";
import { Action } from "redux";
import { call, put, takeLatest } from "redux-saga/effects";
import * as api from "../../api/users";
import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS, User } from "./types";

interface Actions extends Action<string> {
  payload: number;
}

interface SagaAction extends Action<string> {
  payload?: User;
}

function* getUserSaga(action: Actions) {
  try {
    const response: AxiosResponse<User> = yield call(
      api.getUserById,
      action.payload
    );
    yield put<SagaAction>({
      type: GET_USER_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    yield put<SagaAction>({
      type: GET_USER_FAILURE,
      payload: e,
    });
  }
}

export default function* UserSaga() {
  yield takeLatest(GET_USER, getUserSaga);
}
