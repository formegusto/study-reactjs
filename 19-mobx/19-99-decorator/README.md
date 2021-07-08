## Decorator

- 이름과 같이 decorating 해주는 문법이다. HOF와 같이 어떠한 코드를 다른 코드로 감싸준다.

```tsx
/* HOF Example */
function authCheck(CheckComponent: (...args: any) => void) {
  const auth: boolean = false;

  return function () {
    console.log("Auth Checking...");
    CheckComponent(auth);
  };
}

function App(auth: boolean) {
  console.log(auth ? "Auth Checking Okay!" : "Need Auth!");
}

const AuthCheckApp = authCheck(App);
AuthCheckApp();
```

- 해당 예제에 나온 authCheck같이, Component에 AuthCheck를 하는 기능을 추가하는 것과 동일하게, HOF의 가장 큰 목적은 재 사용성이다. Decorator 문법도 코드의 재사용성을 높여주는데, Decorator 문법은 아래와 같은 장점을 가진다.
  1. HOF보다 적용하기 쉽다. 특히, Class나 Class member들에 적용할 때는 훨씬 편하다.
  2. 읽기 쉽고, 코드를 조금 더 깔끔하게 할 수 있다.
  3. JavaScript의 새로운 문법이다.
- 여러 언어에 Decorator가 존재하지만, 기본적으로는 어떤 함수를 인자로 받아서 그 함수의 기능을 좀 더 확장시켜 반환하는 함수이다. JavaScript에서 Decorator는 타입에 따른 인자를 받아 클래스나 그 멤버들을 변경, 확장 시켜주는 함수이다.

```tsx
function authCheck(CheckComponent: typeof App) {
  CheckComponent.prototype.auth = false;
}

@authCheck
class App {
  [key: string]: any;

  render() {
    console.log(this.auth ? "Auth Checking Okay!" : "Need Auth!");
  }
}

const app = new App();
app.render();
```

```tsx
/* 아래와 같이도 사용할 수 있다. */
function authCheck(auth: boolean) {
  return function (CheckComponent: typeof App) {
    CheckComponent.prototype.auth = auth;
  };
}

@authCheck(true)
class App {
  [key: string]: any;

  render() {
    console.log(this.auth ? "Auth Checking Okay!" : "Need Auth!");
  }
}
```

- 항상 데코레이터는 함수라는 것을 명심하자. 그렇기에 당연히 리액트에서도 응용이 가능하다.
