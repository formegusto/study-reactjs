import { AxiosResponse } from "axios";
import { Dispatch } from "react";
import { FINISH_LOADING, START_LOADING } from "../store/loading/types";

export default function createRequestThunk<AR = any, P = any>(
  type: string,
  request: (...params: P[]) => Promise<AxiosResponse<AR>>
) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return (...params: P[]) =>
    async (dispatch: Dispatch<any>) => {
      dispatch({ type: START_LOADING, payload: type });
      dispatch({ type });
      try {
        const response = await request(...params);
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      } catch (e) {
        dispatch({
          type: FAILURE,
          payload: e,
        });
        throw e;
      }
      dispatch({ type: FINISH_LOADING, payload: type });
    };
}
