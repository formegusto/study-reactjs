import { handleActions } from "redux-actions";
import {
  GET_POST,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
  GET_USERS,
  GET_USERS_SUCCESS,
  Post,
  Users,
} from "./types";

type SampleStore = {
  loading: {
    GET_POST: boolean;
    GET_USERS: boolean;
  };
  post: Post | null;
  users: Users | null;
};

const sampleStore: SampleStore = {
  loading: {
    GET_POST: false,
    GET_USERS: false,
  },
  post: null,
  users: null,
};

type Payload = Post | Users;
const SampleReducer = handleActions<SampleStore, Payload>(
  {
    [GET_POST]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: true,
      },
    }),
    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false,
      },
      post: action.payload as Post,
    }),
    [GET_POST_FAILURE]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false,
      },
    }),
    [GET_USERS]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: true,
      },
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false,
      },
      users: action.payload as Users,
    }),
    [GET_USERS_SUCCESS]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false,
      },
    }),
  },
  sampleStore
);

export default SampleReducer;
