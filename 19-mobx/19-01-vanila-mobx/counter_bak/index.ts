import {
  action,
  autorun,
  makeAutoObservable,
  makeObservable,
  observable,
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
  const observeCounter = observable<CounterType>(observeObject) as any;

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

// const state = observable({ value: 0 }) as any;

// const increment = action((state: any) => {
//   state.value++;
// });

// increment(state);

// document
//   .querySelector(".o-inc-btn")!
//   .addEventListener("click", () => increment(state));

// autorun(() => {
//   console.log(state.value);
// });

// class Doubler {
//   value = 0;

//   constructor(value: number) {
//     makeObservable(this, {
//       value: observable,
//       increment: action.bound,
//     });
//   }

//   increment() {
//     this.value++;
//     this.value++;
//   }
// }

// const doubler = new Doubler(10);

// // Calling increment this way is safe as it is already bound.
// setInterval(doubler.increment, 1000);
// autorun(() => {
//   console.log(doubler.value);
// });
