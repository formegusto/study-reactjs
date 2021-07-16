import TodosStore from "./todos";
import UserStore from "./users";

class RootStore {
  UserStore: UserStore;
  TodosStore: TodosStore;

  constructor() {
    this.UserStore = new UserStore(this);
    this.TodosStore = new TodosStore(this);
  }
}

export default RootStore;
