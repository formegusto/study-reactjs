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

/* No-op forwarding proxy */
// proxy 적용된 모든 동작을 허용한다.
var target = {};
var p = new Proxy(target, {});

p.a = 37; // target으로 동작이 전달

console.log(target.a); // 37. 동작이 제대로 전달됨

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

function extend(sup, base) {
  var descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,
    "constructor"
  );
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
console.log(Object.getOwnPropertyDescriptors(Boy));
console.log(Peter.sex); // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age); // 13
