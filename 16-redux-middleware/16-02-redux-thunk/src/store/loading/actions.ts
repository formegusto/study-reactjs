import { createAction } from "redux-actions";
import { FINISH_LOADING, START_LOADING } from "./types";

export const startLoading = createAction<string, string>(
  START_LOADING,
  (type: string) => type
);
export const finishLoading = createAction<string, string>(
  FINISH_LOADING,
  (type: string) => type
);
