import {
  action,
  autorun,
  makeAutoObservable,
  makeObservable,
  observable,
  reaction,
} from "mobx";

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

function FactoryCounter(number: number) {
  return makeAutoObservable({
    number,
    increase() {
      this.number++;
    },
    decrease() {
      this.number--;
    },
  });
}

function factoryRender() {
  const factory = FactoryCounter(0);
  console.log(factory);

  document.querySelector(".f-counter")!.textContent = factory.number.toString();
  document
    .querySelector(".f-inc-btn")!
    .addEventListener("click", factory.increase.bind(factory));
  document
    .querySelector(".f-dec-btn")!
    .addEventListener("click", factory.decrease.bind(factory));

  autorun(() => {
    document.querySelector(".f-counter")!.textContent =
      factory.number.toString();
  });
}
factoryRender();

interface CounterType extends Object {
  number: number;
  increase: () => void;
  decrease: () => void;
}

function observeRender() {
  const observeObject = {
    number: 0,
    increase() {
      this.number++;
    },
    decrease() {
      this.number--;
    },
  };
  const observeCounter = observable<CounterType>(observeObject);

  document.querySelector(".o-counter")!.textContent =
    observeObject.number.toString();
  document
    .querySelector(".o-inc-btn")!
    .addEventListener("click", observeCounter.increase.bind(observeCounter));
  document
    .querySelector(".o-dec-btn")!
    .addEventListener("click", observeCounter.decrease.bind(observeCounter));

  autorun(() => {
    console.log(observeCounter);
    document.querySelector(".o-counter")!.textContent =
      observeCounter.number.toString();
  });
}
observeRender();
