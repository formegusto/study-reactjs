import { all } from "redux-saga/effects";
import UserSaga from "./users/saga";

export default function* RootSaga() {
  yield all([UserSaga()]);
}
