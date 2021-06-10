import { handleActions } from "redux-actions";
import { FINISH_LOADING, START_LOADING } from "./types";

type LoadingStore = {
  [key: string]: boolean;
};
const loadingStore: LoadingStore = {};

const LoadingReducer = handleActions<LoadingStore, string>(
  {
    [START_LOADING]: (state, action) => ({
      [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
      [action.payload]: false,
    }),
  },
  loadingStore
);

export default LoadingReducer;
