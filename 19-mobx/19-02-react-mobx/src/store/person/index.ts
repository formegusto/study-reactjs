import { makeAutoObservable } from "mobx";

class PersonStore {
  name: string;

  constructor() {
    makeAutoObservable(this);
    this.name = "formegusto";
  }

  changeName(value: string) {
    console.log(this);
    this.name = value;
  }
}

export default PersonStore;
