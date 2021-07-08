import axios from "axios";
import { flow, makeAutoObservable, autorun } from "mobx";
import { ResponseError, User } from "./types";

const APIURI = "https://jsonplaceholder.typicode.com";

class Store {
  users: User[] = [];
  user: User | null = null;
  loading = false;
  error: ResponseError = {
    error: false,
    msg: "",
  };

  constructor() {
    makeAutoObservable(this, {
      fetchUsers: flow,
      fetchUser: flow,
    });
  }

  requestError(e: any) {
    this.error = {
      error: true,
      msg: `${e.response.status}:${e.response.statusText}`,
    };
  }

  *fetchUsers(): any {
    try {
      const response = yield axios.get<User[]>(`${APIURI}/users`);

      this.users = response.data;
    } catch (e) {
      this.requestError(e);
    }
  }

  *fetchUser(id: number): any {
    try {
      const response = yield axios.get<User>(`${APIURI}/users/${id}`);

      this.user = response.data;
    } catch (e) {
      this.requestError(e);
    }
  }
}

const store = new Store();
const usersEl = document.querySelector(".users");
const userEl = document.querySelector(".user");

/* Success Catch */
autorun(() => {
  console.log(store.users);

  const users = store.users;
  users.map((user, idx) => {
    const li = document.createElement("li");
    li.classList.add("user");
    li.classList.add(`${user.id}`);

    li.textContent = `${user.name}(${user.email})`;
    li.addEventListener("click", () => store.fetchUser(user.id));

    usersEl?.appendChild(li);
  });
});
autorun(() => {
  userEl!.textContent = JSON.stringify(store.user, null, 2);
});
/* Error Catch */
autorun(() => {
  console.log(store.error);
});
store.fetchUsers();
