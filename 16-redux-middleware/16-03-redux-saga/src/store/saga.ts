import { all } from "redux-saga/effects";
import counterSaga from "./counter/saga";
import sampleSaga from "./sample/saga";

export default function* RootSaga() {
  yield all([counterSaga(), sampleSaga()]);
}
