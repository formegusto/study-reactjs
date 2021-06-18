import { handleActions } from "redux-actions";
import {
  GET_USERS_FAILURE,
  GET_USERS_PENDING,
  GET_USERS_SUCCESS,
  User,
} from "./types";

export type UserStore = {
  users: User[] | null;
  user: User | null;
  loading: {
    users: boolean;
    user: boolean;
  };
  error: {
    users: any | null;
    user: any | null;
  };
};

const userStore: UserStore = {
  users: [],
  user: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: null,
    user: null,
  },
};

const UserReducer = handleActions<UserStore, any>(
  {
    [GET_USERS_PENDING]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        users: true,
      },
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        users: false,
      },
      users: action.payload,
    }),
    [GET_USERS_FAILURE]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        users: true,
      },
      error: {
        ...state.error,
        users: true,
      },
      users: action.payload,
    }),
  },
  userStore
);

export default UserReducer;
