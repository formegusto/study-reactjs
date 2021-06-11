import { all } from "redux-saga/effects";
import counterSaga from "./counter/saga";

export default function* RootSaga() {
  yield all([counterSaga()]);
}
