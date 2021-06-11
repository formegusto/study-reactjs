import { delay, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { decrease, increase } from "./actions";
import { DECREASE_ASYNC, INCREASE_ASYNC } from "./types";

function* increaseSaga() {
  yield delay(1000);
  yield put(increase());
}

function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
  const number: number = yield select((state) => state.counter);
  console.log(`현재 값은 ${number}`);
}

export default function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}
