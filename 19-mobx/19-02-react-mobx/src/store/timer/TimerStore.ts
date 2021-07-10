import { makeAutoObservable } from "mobx";

class TimerStore {
  number: number;

  constructor() {
    makeAutoObservable(this);
    this.number = 0;
  }

  increaseTimer() {
    this.number++;
  }
}

export default TimerStore;
