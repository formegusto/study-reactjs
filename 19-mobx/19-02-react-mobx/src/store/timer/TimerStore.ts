import { action, makeAutoObservable } from "mobx";

class TimerStore {
  number: number;

  constructor() {
    makeAutoObservable(this, {
      increaseTimer: action.bound,
    });
    this.number = 0;
  }

  increaseTimer() {
    this.number++;
  }
}

export default TimerStore;
