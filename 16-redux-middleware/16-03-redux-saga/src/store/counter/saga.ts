import { delay, put, takeEvery, takeLatest } from "redux-saga/effects";
import { decrease, increase } from "./actions";
import { DECREASE_ASYNC, INCREASE_ASYNC } from "./types";

function* increaseSaga() {
  yield delay(1000);
  yield put(increase());
}

function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}

export default function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}
