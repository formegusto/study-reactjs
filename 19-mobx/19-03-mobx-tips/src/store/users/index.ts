import { makeAutoObservable } from "mobx";
import { User } from "./types";
import * as api from "../../lib/api/users";
import { AxiosResponse } from "axios";
import RootStore from "..";

class UserStore {
  root: RootStore;
  users: User[];
  user: User | null;

  constructor(root: RootStore) {
    makeAutoObservable(this);
    this.root = root;
    this.users = [];
    this.user = null;
  }

  *fetchUsers(): Generator {
    try {
      const users = yield api.fetchUsers();

      console.log(users);

      this.users = (users as AxiosResponse<User[]>).data;
    } catch (e) {
      console.error(e.response);
    }
  }

  *fetchUser(id: number): Generator {
    try {
      const user = yield api.fetchUser(id);

      console.log(user);

      this.user = (user as AxiosResponse<User>).data;
    } catch (e) {
      console.error(e.response);
    }
  }
}

export default UserStore;
