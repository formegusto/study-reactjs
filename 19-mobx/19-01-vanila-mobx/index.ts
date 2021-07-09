import axios from "axios";
import { flow, makeAutoObservable, autorun, computed, reaction } from "mobx";
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
      name: computed,
    });
  }

  get name(): string {
    console.log("select user...");
    if (this.user) return `${this.user.name}`;
    else return "";
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
const usernameEl = document.querySelector(".user-name");

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

/* fetchUser Success */
autorun(() => {
  userEl!.textContent = JSON.stringify(store.user, null, 2);
});

/* Computed */
autorun(() => {
  usernameEl!.textContent = store.name;
});

/* Error Catch */
autorun(() => {
  console.log(store.error);
});
store.fetchUsers();

// class Animal {
//   name;
//   energyLevel;

//   constructor(name) {
//     this.name = name;
//     this.energyLevel = 100;
//     makeAutoObservable(this);
//   }

//   reduceEnergy() {
//     this.energyLevel -= 10;
//   }

//   get isHungry() {
//     return this.energyLevel < 50;
//   }
// }

// const giraffe = new Animal("Gary");

// reaction(
//   () => giraffe.isHungry,
//   (isHungry, prev, r) => {
//     if (isHungry) {
//       console.log("Now I'm hungry!");
//     } else {
//       console.log("I'm not hungry!");
//     }
//     console.log("Energy level:", giraffe.energyLevel);
//   }
// );

// console.log("Now let's change state!");
// for (let i = 0; i < 10; i++) {
//   giraffe.reduceEnergy();
// }
