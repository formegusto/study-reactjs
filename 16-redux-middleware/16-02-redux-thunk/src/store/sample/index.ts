import { handleActions } from "redux-actions";
import { GET_POST_SUCCESS, GET_USERS_SUCCESS, Post, User } from "./types";

type SampleStore = {
  post?: Post | null;
  users?: User[] | null;
};

const sampleStore: SampleStore = {
  post: null,
  users: null,
};

type Payload = Post | User[];
const SampleReducer = handleActions<SampleStore, Payload>(
  {
    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      post: action.payload as Post,
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      users: action.payload as User[],
    }),
  },
  sampleStore
);

export default SampleReducer;
