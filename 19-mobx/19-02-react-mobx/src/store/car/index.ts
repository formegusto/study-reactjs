import { makeAutoObservable } from "mobx";

class CarStore {
  name: string;

  constructor() {
    makeAutoObservable(this);
    this.name = "MINI";
  }

  changeName(value: string) {
    console.log(this);
    this.name = value;
  }
}

export default CarStore;
