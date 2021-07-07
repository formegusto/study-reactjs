import { action, autorun, makeObservable, observable, reaction } from "mobx";

class Counter {
  number: number;

  constructor(number: number) {
    makeObservable(this, {
      number: observable,
      increase: action,
      decrease: action,
    });
    document
      .querySelector(".inc-btn")!
      .addEventListener("click", this.increase);
    document
      .querySelector(".dec-btn")!
      .addEventListener("click", this.decrease);
    this.number = number;

    autorun(() => {
      console.log(this.number);
      document.querySelector(".counter")!.textContent = this.number.toString();
    });
  }

  increase = () => {
    this.number++;
  };

  decrease = () => {
    this.number--;
  };
}

new Counter(0);
