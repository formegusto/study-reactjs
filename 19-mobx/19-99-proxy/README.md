## Proxy

- 자바스크립트에서 Proxy 객체는 기본 작업, 속성 조회, 할당, 열거, 함수 호출 등에 대한 행위에 대해 사용자의 커스텀 동작을 정의할 때 사용할 수 있다.

```tsx
var p = new Proxy(target, handler);
```

- 용어
  1. handler : trap들을 가지고 있는 Plcaeholder 객체
  2. traps : 프로퍼티에 접근할 수 있는 메소드. 운영체제에서 trap이라는 컨셉과 유사하다.
  3. target : proxy가 가상화하는 실제 객체. 이것은 proxy를 위한 backend 저장소로 사용된다.
- 매개변수
  1. target : proxy와 함께 감싸진 target 객체
  2. handler : 프로퍼티들이 function인 객체이다. 동작이 수행될 때, handler는 proxy의 행동을 정의한다.
- 메서드

  Proxy.revocable() : 폐기할 수 있는(revocable) Proxy 객체를 생성

```tsx
/* Basic Example */
var handler = {
  get: function (target, name) {
    /* target에 key가 존재하지 않으면 37을 리턴한다. */
    return name in target ? target[name] : 37;
  },
};

var p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log("c" in p, p.c); // false, 37
```

```tsx
/* No-op forwarding proxy */
// proxy 적용된 모든 동작을 허용한다.
var target = {};
var p = new Proxy(target, {});

p.a = 37; // target으로 동작이 전달

console.log(target.a); // 37. 동작이 제대로 전달됨
```

```tsx
/* Validation */
/* 중간에 가로채기 전에 검증을 수행할 수 있다. */
let validator = {
  set: function (obj, prop, value) {
    if (prop === "age") {
      if (!Number.isInteger(value)) {
        throw new TypeError("The age is not an integer");
      }
      if (value > 200) {
        throw new RangeError("The age seems invalid");
      }
    }

    // The default behavior to store the value
    obj[prop] = value;
  },
};

let person = new Proxy({}, validator);

person.age = 100;
console.log(person.age); // 100
// person.age = "young"; // Throws an exception
// person.age = 300; // Throws an exception
```

```tsx
// 아래와 같이 새로운 생성자와 함께 생성자를 확장할 수 있다.
// 코드는 다음과 같다.
function extend(sup, base) {
  var descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,
    "constructor"
  );
  // 부모 클래스의 prototype을 붙여준다. (prototype chain)
  base.prototype = Object.create(sup.prototype);
  var handler = {
    construct: function (target, args) {
      var obj = Object.create(base.prototype);
      this.apply(target, obj, args);
      return obj;
    },
    apply: function (target, that, args) {
      sup.apply(that, args);
      base.apply(that, args);
    },
  };
  var proxy = new Proxy(base, handler);
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, "constructor", descriptor);
  return proxy;
}

var Person = function (name) {
  this.name = name;
};

var Boy = extend(Person, function (name, age) {
  this.age = age;
});

Boy.prototype.sex = "M";

var Peter = new Boy("Peter", 13);
console.log(Peter.sex); // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age); // 13
```

- 중요한 것은 get과 set이라는 점, 그리고 클래스를 확장할 수 있다는 점이다.
- get은 조회를 할 때, 중간에 가로채서 어떠한 작업을 할 수 있고, set은 target에 값을 수정할 때, 어떠한 작업을 수행시킬 수 있다.
