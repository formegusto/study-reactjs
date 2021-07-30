## 3. Understanding reactivity

- MobX는 반응에 최적화되어 있기 때문에 90% 정도의 상황에서는 그냥 MobX의 반응을 따라가는 것이 좋다. 그래서 MobX가 어떻게 반응을 하는지 이해하는 것이 중요하다.
- 읽는 것은 object의 property를 참조해야 한다. dotting into, eq [user.name](http://user.name) or user['name'] 같이 접근하는 것을 말한다.
- 추적 함수로는 computed를 사용한다.
- "during" 이라는 개념이 등장하는데 오직 읽고 있는 observable value만 추척된다. 하지만 함수 등에서 새로 생성한 값에 대해서는 추적하지 않는다.

### 1. MobX tracks property access, not values

- MobX는 프로퍼티를 추적한다. 값을 추적하는 개념이 아니다.

```tsx
type Author = {
  name: string;
};

class Message {
  title: string;
  author: Author;
  likes: string[];
  constructor(title: string, author: Author, likes: string[]) {
    makeAutoObservable(this);
    this.title = title;
    this.author = author;
    this.likes = likes;
  }

  updateTitle(title: string) {
    this.title = title;
  }

  changeAuthor(name: string) {
    this.author = {
      name: name,
    };
  }

  changeAuthorName(name: string) {
    this.author.name = name;
  }
}
```

- 이게 무슨 소리냐면, 위와 같은 구조를 가진 스토어를 사용하는 observer container의 모습을 보자.

```tsx
function MessageContainer({ store }: Props) {
  return <MessageComponent title={store.title} author={store.author} />;
}
```

- 그리고 하위에서 View를 보여주고 있는 Component를 봐보자.

```tsx
function MessageComponent({
  title,
  author,
  changeAuthor,
  changeAuthorName,
}: Props) {
  return (
    <>
      <h1>{title}</h1>
      <h2>Author: {author.name}</h2>
      <input
        type="text"
        value={author.name}
        onChange={(e) => changeAuthor(e.target.value)}
        placeholder="Change Author"
      />
      <input
        type="text"
        value={author.name}
        onChange={(e) => changeAuthorName(e.target.value)}
        placeholder="Change Author Name"
      />
    </>
  );
}
```

- input을 두 개를 준비하고 store에 2개의 액션을 사용하고 있다. 하나는 지금 observer container에서 읽고 있는 author 자체의 값을 변경하는 changeAuthor이고, 하나는 하위 컴포넌트에서 읽고 있는 [author.name](http://author.name) 의 값을 변경하는 changeAuthorName 이벤트를 달고 있다.
- 아래의 인풋은 아무리 값을 고쳐도 재 렌더링 하지 않는다. 액션은 발생하지만 변화한 것에 대해서 재 렌더링 되지 않는다. 그 이유는 observer component에서 읽고 있는 값은 store.author다. store.author.name이 아니다. 프로퍼티를 추적한다는 의미가 이것이다. 그 안에 값이 변경되는 것은 감시하지 않는다. 감시하고 있는 프로퍼티 자체의 값이 변경해야 재 렌더링한다. 그것을 추적한다는 의미이다.
- 그래서 위 코드는 observer component에서 store.author.name을 추적하면 아래 input도 동작을 한다.

> Note that the values themselves are not observable!

```tsx
<MessageComponent
  title={store.title}
  authorName={store.author.name}
  changeAuthor={store.changeAuthor}
  changeAuthorName={store.changeAuthorName}
/>
```

## 4. Understading reactivity - MobX Reactivity

### 0. TypeScript

```tsx
"useDefineForClassFields": true
```

### 1. Correct: dereference inside the tracked function

```tsx
autorun(() => {
  console.log(message.title); // Foo!
});
message.updateTitle("Bar");
```

- 위의 내용은 가장 일반적인 내용으로 .title이 autorun에 의해 역참조 되어서 변화된 후 이를 감지한다.

> trace

- mobx에서 제공하는 함수 중 trace 라는 함수를 우리는 사용할 수 있다. 이는 autorun의 상황을 보여준다.

```tsx
const disposer = autorun(() => {
  console.log(message.title);
  trace();
});
// Outputs:
// [mobx.trace] 'Autorun@2' tracing enabled

message.updateTitle("Hello");
// Outputs:
// [mobx.trace] 'Autorun@2' is invalidated due to a change in: 'Message@1.title'
```

> getDependencyTree

- MobX에서 제공해주는 getDependency함수는 내부 종속성 트리를 보여준다.

```tsx
// Prints the dependency tree of the reaction coupled to the disposer.
console.log(getDependencyTree(disposer));
// Outputs:
// { name: 'Autorun@2', dependencies: [ { name: 'Message@1.title' } ] }
```

### 2. Incorrect: Changing a non-observable reference

```tsx
autorun(() => {
  console.log(message.title);
});
message = new Message("Bar", { name: "Martijn" }, ["Felicia", "Marcus"]);
```

- 다음과 같이 이미 참조 중이었던 observable이 있을 경우, 이를 감지하는 autorun을 선언해줬는데, 후에 이 observable을 바꾸면 autorun은 동작하지 않는다.

### 3. Incorrect: dereference outside of a tracked function

```tsx
let title = message.title;
autorun(() => {
  console.log(title);
});
message.updateMessage("Bar");
```

- 다음과 같이 observable value를 다른 변수에 할당하면 역추적할 수가 없다. 역추적의 주체는 observable object 이기 때문이다.

### 4. Correct: dereference inside the tracked function

```tsx
autorun(() => {
  console.log(message.author.name);
});

runInAction(() => {
  message.author.name = "Sara";
});
runInAction(() => {
  message.author = { name: "Joe" };
});
```

- runInAction은 외부에서도 observable value에 변화를 일으키고, autorun까지 실행될 수 있도록 해준다.

### 5. Incorrect: store a local reference to an observable object without tracking

```tsx
const author = message.author;
autorun(() => {
  console.log(author.name);
});

runInAction(() => {
  message.author.name = "Sara";
});
runInAction(() => {
  message.author = { name: "Joe" };
});
```

- 다음과 같이 지역변수에 할당한 경우, .name 프로퍼티는 역추적을 하지만 message.author는 추적하지 않는다. message.author에 새로운 값이 들어오면서 해당 autorun은 의미가 없어진다.

### 6. Common pitfall: console.log

```tsx
autorun(() => {
  console.log(message);
});

// Won't trigger a re-run.
message.updateTitle("Hello world");
```

- 이는 추적하지 않는다. 그 이유는 observable object 안에 observable value들을 추적하는 거기 때문이다. 그 자체를 보고 있는 autorun은 동작하지 않는다.

### 7. Correct: access array properties in tracked function

```tsx
autorun(() => {
  console.log(message.likes.length);
});
message.likes.push("Jennifer");
```

- observable value에서의 배열의 경우, 프로퍼티를 조회하고 추적할 수 있다.

### 8. Incorrect: access out-of-bounds indices in tracked function

```tsx
autorun(() => {
  console.log(message.likes[0]);
});
message.likes.push("Jennifer");
```

- 위의 autorun은 정상적으로 추적한다. 하지만 오직 배열의 길이 보다 작은 index에 대해서만 동작한다.

### 9. Correct: access array functions in tracked function

```tsx
autorun(() => {
  console.log(message.likes.join(", "));
});
message.likes.push("Jennifer");
```

- 배열의 특정 함수들에도 접근할 수 있다.

### 10. Incorrect: "use" an observable but without accessing any of its properties

```tsx
autorun(() => {
  message.likes;
});
message.likes.push("Jennifer");
```

- 사용은 하지만 접근하지 않는 프로퍼티에 대해서는 동작하지 않는다.

### 11. Correct: using not yet existing map entries

```tsx
const twitterUrls = observable.map({
  Joe: "twitter.com/joey",
});

autorun(() => {
  console.log(twitterUrls.get("Sara"));
});

runInAction(() => {
  twitterUrls.set("Sara", "twitter.com/horsejs");
});
```

- 아직 존재하지 않는 맵 엔트리들도 추적할 수 있다.

### 12. MobX does not track asynchronously accessed data

```tsx
autorun(() => {
  setTimeout(() => console.log(message.likes.join(", ")), 10);
});

runInAction(() => {
  message.likes.push("Jennifer");
});
```

- autorun에 비동기함수가 들어가 있는 경우에는 동작하지 않는다. 또한 위는 autorun의 주체가 아닌 setTimeout안에서의 주체이기 때문에 동작하지 않는다.

### 13. using non-observable object properties

```tsx
autorun(() => {
  console.log(message.author.age);
});

runInAction(() => {
  message.author.age = 10;
});
```

- 새로운 property를 추가하는 경우에도 이는 동작한다.

### 14. [Without Proxy support] Correct: using MobX utilities to read / write to objects

```tsx
import { get, set, observable } from "mobx";

const twitterUrls = observable.object({
  Joe: "twitter.com/joey",
});

autorun(() => {
  console.log(get(twitterUrls, "Sara")); // `get` can track not yet existing properties.
});

runInAction(() => {
  set(twitterUrls, { Sara: "twitter.com/horsejs" });
});
```

- get 혹은 set을 활용해서 MobX를 제어할 수도 있다.
