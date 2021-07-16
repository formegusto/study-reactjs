import { Todo } from "./types";
import { makeAutoObservable } from "mobx";
import * as api from "../../lib/api/todos";
import { AxiosResponse } from "axios";
// import UserStore from "../users";
import RootStore from "..";

class TodosStore {
  root: RootStore;
  todos: Todo[];
  // userStore: UserStore;

  constructor(root: RootStore) {
    makeAutoObservable(this);
    this.root = root;
    // this.userStore = new UserStore();
    this.todos = [];
  }

  // fetchUser(idx: number) {
  //   this.userStore.fetchUser(this.todos[idx].userId);
  // }

  *fetchTodos(): Generator {
    try {
      const res = yield api.fetchTodos();

      console.log(res);
      this.todos = (res as AxiosResponse<Todo[]>).data;
    } catch (e) {
      console.error(e.response);
    }
  }
}

export default TodosStore;
