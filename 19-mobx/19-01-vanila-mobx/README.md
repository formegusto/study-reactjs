# 2. Vanila Mobx With Mobx Core

## 1. Observable State

- 속성, 객체, 배열, Maps 그리고 Sets 모두 관찰가능한 상태로 만들 수 있다.
- Observable Object를 만드는 가장 쉬운 방법은 makeObservable과 함께 어노테이션을 사용하는 것이다. 어노테이션의 종류는 다음과 같다.
  1. observable : 스토어의 상태를 (변화를) 추적 가능한 필드로 정의한다.
  2. action : 상태의 값을 조작하는 메서드를 표시한다.
  3. computed : 새로운 형태의 상태의 연산이 필요한 경우 사용된다.

### 1. makeObservable

```tsx
makeObservable(target, annoations?, options?);
/*
	target: store 객체
	annotations: store 멤버들의 역할 정의
		(+) decorators 문법으로 스킵할 수 있다.
		(+) MobX Version 6 이전에는 Decorator 문법을 사용했지만, 이는 아직 ES 표준이 아닐뿐더러,
			표준화 시간이 오래걸릴거 같아서 MobX Version 6에서는
			makeObservable과 makeAutoObservalble을 사용하기를 권장하고 있다.
*/
```

- makeObservable의 annotations는 공식 문서 상 4가지가 있다.
  1. observable : 관찰할 상태값
  2. computed : 변화한 상태에 따라 연산할 함수
  3. action : 상태에 변화를 줄 함수
  4. flow : 취소가능한 상태(generator)를 통해 async / await 을 대체해주는 함수

### 2. makeAutoObservable

```tsx
makeAutoObservable(target, overrides?, options?)
/*
	모든 프로퍼티는 observable 상태가 된다.
	모든 get 함수들은 computed가 된다.
	모든 set 함수들은 action이 된다.
	모든 prototype function은 autoAction이 된다.
	모든 generator 함수들은 flow가 된다.
	overrides 인자에 false와 함께 넘겨주는 멤버는 어노테이션을 가지지 않고,
		오로지 읽기 가능한 상태의 필드가 된다.
*/
```

### 3. observable

```tsx
observable(source, overrides?, options?)
/*
	observalbe 어노테이션은 하나의 관찰가능한 객체를 만들때 사용할 수 있다.
	source의 객체는 복사하거나 모든 멤버를 관찰 가능한 상태로 만든다.
	마치 makeAutoObservalbe과 같이 작동한다.
	observable에 의해 반환되는 객체는 Proxy이다. 이는 나중에 관찰가능한 상태의 객체를 추가할 수
	있다는 것을 의미한다.
	proxy 설정을 끄려면 아래와 같이 설정하면 된다.
	observable 메서드는 오로지 컬렉션 타입들로만 호출할 수 있다.
*/

import { configure } from "mobx"

configure({
    useProxies: "never"
})
```

## 2. Actions

- 모든 어플리케이션들은 action들을 갖는다. 하나의 action은 상태에 변화를 주는 코드를 말한다. action은 버튼 클릭, 인풋의 변화와 같은 이벤트의 응답에 의해서 일어난다.
- action annotation은 오로지 상태를 조작하는 함수들에만 사용할 수 있다.

### 1. action(fn)

```tsx
const state = observable({ value: 0 }) as any;

const increment = action((state: any) => {
  state.value++;
});

increment(state);
```

- 이렇게 함수를 감싸주는 action 함수는 다른곳에서도 많이 활용될 수가 있다.

```tsx
const ResetButton = ({ formState }) => (
  <button
    onClick={action((e) => {
      formState.resetPendingUploads();
      formState.resetValues();
      e.stopPropagation();
    })}
  >
    Reset form
  </button>
);
```

### 2. action.bound

- action.bound annotation은 자동적으로 메서드를 자신의 메서드에 바인딩할 수 있다. 여기서 사용하는 this는 항상 자신을 호출하는 함수를 가리킨다.

```tsx
class Doubler {
  value = 0;

  constructor(value: number) {
    makeObservable(this, {
      value: observable,
      increment: action.bound,
    });
  }

  increment() {
    this.value++;
    this.value++;
  }
}

const doubler = new Doubler(10);

// Calling increment this way is safe as it is already bound.
setInterval(doubler.increment, 1000);
// 원래는 기본 action으로 사용하면 increment는 setInterval에서 일반함수로서 호출이 되기 때문에
// 전역객체 value가 연산이 되어버린다.
// 하지만 action.bound를 해주면 Doubler가 자동으로 바인딩된다.
```

### 3. runInAction(fn)

- 직접적으로 action을 호출할 때, 사용한다. 주로 비동기 호출에서 사용되는데, 이게 왜냐하면 action 안에서 Promise를 사용할 경우 then을 사용하면 이는 action 함수가 호출하는 함수가 아닌, then이 호출하는 함수가 되어버린다. 그래서 상태 변화에 대응하지 못하게 된다.
- 그래서 then에도 action 함수를 만들어서 붙이거나 할 수 있는데, 이렇게 되면 또 action.bound를 이용해야 한다.
- 이 때 then 안에서도 상태변화를 주기 위하여 runInAction을 사용한다.

```tsx
action(() => {
  axios
    .get("/api/todos")
    .then(() => {
      runInAction(() => {
        this.state = "Success!";
      });
    })
    .catch((e) => {
      runInAction(() => {
        this.state = "Error!";
      });
    });
});
```

### 4. makeAutoObservable

```tsx
class Doubler {
  value = 0;

  constructor(value) {
    makeAutoObservable(this);
  }

  increment() {
    this.value++;
    this.value++;
  }
}
```

### 5. Asynchronous Actions

> Wrap handle In "action"

- Promise에 Action으로 감싼 함수를 넣어주는 방식

```tsx
class Store {
  githubProjects = [];
  state = "pending"; // "pending", "done" or "error"

  constructor() {
    makeAutoObservable(this);
  }

  fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    fetchGithubProjectsSomehow().then(
      action("fetchSuccess", (projects) => {
        const filteredProjects = somePreprocessing(projects);
        this.githubProjects = filteredProjects;
        this.state = "done";
      }),
      action("fetchError", (error) => {
        this.state = "error";
      })
    );
  }
}
```

> Handle updates in separate actions

- 액션 함수들을 따로 나누어서 Promise 결과에 넣어주는 방식

```tsx
class Store {
  githubProjects = [];
  state = "pending"; // "pending", "done" or "error"

  constructor() {
    makeAutoObservable(this);
  }

  fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    fetchGithubProjectsSomehow().then(
      this.projectsFetchSuccess,
      this.projectsFetchFailure
    );
  }

  projectsFetchSuccess = (projects) => {
    const filteredProjects = somePreprocessing(projects);
    this.githubProjects = filteredProjects;
    this.state = "done";
  };

  projectsFetchFailure = (error) => {
    this.state = "error";
  };
}
```

> async/await + runInAction

- async 함수에서 상태 변화부분에서만 액션을 일으키는 방식

```tsx
class Store {
  githubProjects = [];
  state = "pending"; // "pending", "done" or "error"

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    try {
      const projects = await fetchGithubProjectsSomehow();
      const filteredProjects = somePreprocessing(projects);
      runInAction(() => {
        this.githubProjects = filteredProjects;
        this.state = "done";
      });
    } catch (e) {
      runInAction(() => {
        this.state = "error";
      });
    }
  }
}
```

> `flow` + generator function

- generate 함수를 이용하는 방식

```tsx
class Store {
  githubProjects = [];
  state = "pending";

  constructor() {
    makeAutoObservable(this, {
      fetchProjects: flow,
    });
  }

  // Note the star, this a generator function!
  *fetchProjects() {
    this.githubProjects = [];
    this.state = "pending";
    try {
      // Yield instead of await.
      const projects = yield fetchGithubProjectsSomehow();
      const filteredProjects = somePreprocessing(projects);
      this.state = "done";
      this.githubProjects = filteredProjects;
    } catch (error) {
      this.state = "error";
    }
  }
}

const store = new Store();
const projects = await flowResult(store.fetchProjects());
```

- MobX 공식 문서에서는 async/await 대신에 flow를 사용할 것을 권장하고 있다. 이는 generator 함수의 특성 때문인데, cancel()이라는 함수를 실행시키면 함수를 도중에 중지 시킬 수 있다.

## 3. Computeds

- Computed Value들은 관찰상태인 상태들의 정보를 유도시킬 수 있다. Computed는 출력을 캐싱하고 관찰상태의 항목 중 하나가 변경된 경우에만 다시 계산을 한다. 아무것도 관찰되지 않으면 완전히 일시 중지 상태가 된다.
- 개념적으로 스프레드시트의 수식과 매우 유사하다. 저장해야 하는 상태의 양을 줄이는 데 도움이 되며, 고도로 최적화되어 있다. 가능한 사용하기를 권장하고 있다.
- 자바스크립트의 getter와 함께 사용하면 Computed Values를 만들 수 있다. makeObservable을 사용하는 경우, computed 어노테이션을 지정해주면 된다.

```tsx
class OrderLine {
  price = 0;
  amount = 1;

  constructor(price) {
    makeObservable(this, {
      price: observable,
      amount: observable,
      total: computed,
    });
    this.price = price;
  }

  get total() {
    console.log("Computing...");
    return this.price * this.amount;
  }
}

const order = new OrderLine(0);

const stop = autorun(() => {
  console.log("Total: " + order.total);
});
// Computing...
// Total: 0

console.log(order.total);
// (No recomputing!)
// 0

order.amount = 5;
// Computing...
// (No autorun)

order.price = 2;
// Computing...
// Total: 10

stop();
// autorun은 stop 함수를 반환하며 언제든지 실행을 중지 시킬 수 있다.

order.price = 3;
// Neither the computation nor autorun will be recomputed.
```

> Computed Flow

![https://mobx.js.org/assets/computed-example.png](https://mobx.js.org/assets/computed-example.png)

- get total 에 속한 멤버인 price 혹은 amount가 변화하면 total의 값이 변화한다. 이 때, total에서 연산된 값이 변화할 경우 autorun이 작동한다.
- 위의 이론대로 해서 amount에서는 autorun이 작동이 안된이유는 price가 여전히 0이기 때문에 total 값이 0으로 고정됐기 때문에 autorun이 작동하지 않았다.

> Computed Rules

- Computed 함수에서는 관찰중인 상태의 값을 변경하는 용도나, Side Effects의 용도로 사용하면 안된다.
- 새로운 상태값을 만들거나 반환하면 안된다.

## 4. Reactions

> Running side effects with reactions

- reactions는 mobx의 모든 것이라고 말할 수 있을 정도로, 그 컨셉을 이해하는 것이 매우 중요하다.
- reactions의 목표는 자동적으로 모델의 side effects를 주는 것이다.
- reactions는 관찰 가능한 상태에 대한 consumer를 만들고, 이 상태가 변경될 때 자동으로 side effects를 실행한다.
- 하지만 실제로는 거의 사용이 잘 되지 않는다. mobx-react와 같은 라이브러리를 사용하는 경우, 이들을 사용할 일이 거의 없을 것이다.

### 1. autorun

```tsx
autorun(effect: (reaction) => void)
```

- autorun 함수는 변화를 관찰한다. 해당 함수는 오직 autorun을 생성한 시점에서 한번 실행된다. 그 후 안에 있는 상태값이 변화할때만 동작한다. 해당 상태값은 observable 혹은 computed 여야 한다.

> How tracking works?

![https://mobx.js.org/assets/autorun.png](https://mobx.js.org/assets/autorun.png)

- 플로우는 다음과 같다. 초기에 autorun을 실행시키면 해당 함수는 함수 안에서 사용된 상태를 구독한다. 그리고 이를 업데이트 하는 action이 발생하면 해당 상태가 자신의 변화를 알리고, autorun의 함수가 재 실행된다.

```tsx
class Animal {
  name;
  energyLevel;

  constructor(name) {
    this.name = name;
    this.energyLevel = 100;
    makeAutoObservable(this);
  }

  reduceEnergy() {
    this.energyLevel -= 10;
  }

  get isHungry() {
    return this.energyLevel < 50;
  }
}

const giraffe = new Animal("Gary");

autorun(() => {
  console.log("Energy level:", giraffe.energyLevel);
});

autorun(() => {
  if (giraffe.isHungry) {
    console.log("Now I'm hungry!");
  } else {
    console.log("I'm not hungry!");
  }
});

console.log("Now let's change state!");
for (let i = 0; i < 10; i++) {
  giraffe.reduceEnergy();
}
```

```tsx
Energy level: 100
I'm not hungry!
Now let's change state!
Energy level: 90
Energy level: 80
Energy level: 70
Energy level: 60
Energy level: 50
Energy level: 40
Now I'm hungry!
Energy level: 30
Energy level: 20
Energy level: 10
Energy level: 0
```

- autorun은 초기에 한번 실행된다. 이후에는 상태가 변화할 때만 실행되는데, 위에서 볼 수 있듯이 observable 상태의 energyLevel은 for문안에 액션에 의해 계속해서 변화해서 autorun이 매 루프 단계 마다 실행이 되지만, computed 상태의 isHungry는 energyLevel이 50 아래로 내려가는 순간 변화하기 때문에 그 시점에만 실행이 됐다.

### 2. reaction

```tsx
reaction(() => value, (value, previousValue, reaction) => { sideEffect }, options?)
```

- autorun과 같지만, 더 많은 상태 제어값을 전달해준다. 두개의 함수를 전달받는데, 첫번째 함수는 변화를 관찰할 데이터가 들어간다. 두번째 함수에는 sideEffectf 로직이 들어간다. 이 때, previouseValue는 상태가 변화하기 전의 값이 들어가고, reaction에는 Reaction 객체가 들어간다.
- autorun과 다른점은 초기에 한번 실행되지 않고, 초기에 구독만 해놓고 상태가 한번 변화했을 때 실행된다.

### 3. when

```tsx
when(predicate: () => boolean, effect?: () => void, options?)
when(predicate: () => boolean, options?): Promise
```

- 매개변수 predicate가 true를 반환할 때 까지 상태를 추적한다.
- predicate가 true를 반환하면, effect 함수를 실행한다.

> await when

- 2번째 인자인 함수를 넘기지 않으면 when은 Promise를 반환하는데, 이를 이용해서 observable state가 변경되는 시점까지 기다릴 수 있다.

### 4. Rules

- reactions의 실행은 관찰 중인 상태가 변화할때만 실행된다. 그러므로, action이 일어나기 전에는 실행되지 않는다.
- autorun은 무조건 동기적으로 실행된다. 이들은 비동기적인 모든 상황을 추적하지 않는다.
- autorun은 action은 항상 추적하지 않는다.
- reactions는 남용하지 않는것이좋다. 아래와 같은 규칙을 따져가면서 사용하는 것이 좋다.
  - 원인과 결과 사이에 직접적인 관계가 없는 경우에만 사용.
  - 다른 관찰 대상을 업데이트해서는 안된다. 일반적으로 다른 관찰 대상을 수정하는 경우에는 computed 값을 사용한다.
  - 독립적이어야 한다. 다른 reactions와 의존성이 존재하면 안된다. MobX는 reactions가 실행되는 순서를 보장하지 않는다.
