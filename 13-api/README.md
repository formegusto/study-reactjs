# 외부 API 연동하기

# 1. 비동기 작업의 이해

- 웹 어플리케이션을 만들다 보면 처리할 때 시간이 걸리는 작업들이 있다. 이들은 보통 비동기적으로 처리하게 된다.
- 처리하는데 오래 걸리는 작업들을 동기적으로 처리하게 되면 해당 작업이 끝나기 전까지 블로킹 상태가 되기 때문에 다른 작업을 할 수 없다.
- 하지만 이를 비동기적으로 처리한다면 웹 어플리케이션이 멈추지 않기 때문에 동시에 여러 가지 요청을 처리할 수도 있고, 기다리는 과정에서 다른 함수도 호출할 수 있다.

## 1. 콜백 함수

```tsx
function increase(number, callback) {
  setTimeout(() => {
    const result = number + 10;
    if (callback) {
      callback(result);
    }
  }, 1000);
}

increase(0, (result) => {
  console.log(result);
});
```

- 이러한 콜백 함수 패턴은 콜백 안에 또 콜백을 넣어서 구현할 수 있는데, 너무 여러번 중첩되면 코드의 가독성이 나빠진다. 이를 '콜백 지옥' 이라고 부른다.

```tsx
increase(0, (result) => {
  console.log(result);
  increase(result, (result) => {
    console.log(result);
    increase(result, (result) => {
      console.log(result);
    });
  });
});
```

## 2. Promise

- Promise는 콜백 지옥 같은 코드가 형성되지 않게 하는 방안으로 ES6에 도입된 기능이다.

```tsx
function increase(number) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = number + 10;
      if (result > 50) {
        const e = new Error('NumberToBig');
        return reject(e);
      }
      resolve(result);
    }, 1000);
  });

  return promise;
}

increase(0)
  .then((number) => {
    console.log(number);
    return increase(number);
    // Promise를 리턴하면 다음 then에서 처리 가능하다.
  })
  .then((number) => {
    console.log(number);
    return increase(number);
  })
  .then((number) => {
    console.log(number);
    return increase(number);
  })
  .then((number) => {
    console.log(number);
    return increase(number);
  })
  .then((number) => {
    console.log(number);
    return increase(number);
  })
  .then((number) => {
    console.log(number);
    return increase(number);
  })
  .catch((e) => {
    console.error(e);
  });
```

- 여러 작업을 연달아 처리한다고 해서 함수를 여러 번 감싸는 것이 아니라 .then을 사용하여 그 다음 작업을 설정하기 때문에 콜백 지옥이 형성되지 않는다.

## 3. async / await

- async / await 은 Promise를 더욱 쉽게 사용할 수 있도록 해주는 ES2017(ES8) 문법이다.
- 이 문법의 핵심은 함수의 앞 부분에 async키워드를 추가하고, 해당 함수 내부에서 Promise의 앞부분에 await 키워드를 사용한다. 이렇게 하면 Promise가 끝날 때까지 기다리고, 결과 값을 특정 변수에 담을 수 있다.

```tsx
async function runTasks() {
  try {
    let result = await increase(0);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
    console.log(result);
    result = await increase(result);
  } catch (e) {}
}
```

# 2. axios로 API 호출해서 데이터 받아 오기

- axios는 현재 가장 많이 사용되고 있는 자바스크립트 HTTP 클라이언트이다.
- 특징은 HTTP 요청을 Promise 기반으로 처리한다는 점이다.

```tsx
type ApiResult = {
  title: string;
  completed: boolean;
};

function App() {
  const [data, setData] = useState<ApiResult>();

  const onClick = async () => {
    try {
      const res = await axios.get<ApiResult>(
        'https://jsonplaceholder.typicode.com/todos/1',
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea rows={7} value={JSON.stringify(data, null, 2)} readOnly />
      )}
    </div>
  );
}
```

# 3. newsapi API 키 발급받기

[News API - Search News and Blog Articles on the Web](https://newsapi.org/)

1. 전체 뉴스 불러오기

   - https://newsapi.org/v2/top-headlines?country=kr&apiKey={API_KEY}

2. 특정 카테고리 뉴스 불러오기

   - https://newsapi.org/v2/top-headlines?country=kr&category={CAT_NAME}&apiKey={API_KEY}

```tsx
const onClick = async () => {
  try {
    const res = await axios.get<ApiResult>(
      `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${process.env.REACT_APP_API_KEY}`,
    );
    setData(res.data);
  } catch (e) {
    console.error(e);
  }
};
```

# 4. APIResult 구조 파악하기

```json
"articles": [
    {
      "source": {
        "id": "google-news",
        "name": "Google News"
      },
      "author": null,
      "title": "[이슈톡] 배우 하정우, 프로포폴 불법 투약 약식기소 (2021.06.04/뉴스투데이/MBC) - MBCNEWS",
      "description": null,
      "url": "https://news.google.com/__i/rss/rd/articles/CBMiK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9YVNKcmtDS1M5OVXSAQA?oc=5",
      "urlToImage": null,
      "publishedAt": "2021-06-03T22:31:28Z",
      "content": null
    },
		// ...
]
```

## 1. 타입으로 표현하기

[Instantly parse JSON in any language | quicktype](https://app.quicktype.io/)

```tsx
type Articles = {
  status: string;
  totalResults: number;
  articles: Article[];
};

type Article = {
  source: Source;
  author: null | string;
  title: string;
  description: null | string;
  url: string;
  urlToImage: null | string;
  publishedAt: Date;
  content: null | string;
};

type Source = {
  id: null | string;
  name: string;
};
```

# 5. 데이터 연동하기

- 컴포넌트가 처음 렌더링되는 시점에 API를 요청하면 된다.
- 주의할 점은 useEffect에서 반환해야 하는 값은 뒷정리 함수 이기 때문에 async를 매개변수로 보내주면 안된다. 따라서 useEffect 내부에서 async/await 을 사용하고 싶다면, 함수 내부에 async 키워드가 붙은 또 다른 함수를 만들어서 사용해 주어야 한다.

```tsx
function NewsList() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Articles>(
          `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${process.env.REACT_APP_API_KEY}`,
        );
        setArticles(res.data.articles);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <NewsListBlock>대기 중...</NewsListBlock>;

  return (
    articles && (
      <NewsListBlock>
        {articles.map((article) => (
          <NewsItem article={article} key={article.url} />
        ))}
      </NewsListBlock>
    )
  );
}
```

- NewsList안에서 map 함수를 사용하는데, 이를 사용하기 전에 꼭 articles를 null check 해서 렌더링 과정에서 오류가 발생하지 않도록 한다.

# 6. 카테고리 기능

- NewsAPI Category List

  business, science, entertainment, sports, health, technology

- store 설정

  ```tsx
  const categories: Category[] = [
    {
      name: 'all',
      text: '전체보기',
    },
    {
      name: 'business',
      text: '비즈니스',
    },
    {
      name: 'entertainment',
      text: '연예',
    },
    {
      name: 'health',
      text: '건강',
    },
    {
      name: 'science',
      text: '과학',
    },
    {
      name: 'sports',
      text: '스포츠',
    },
    {
      name: 'technology',
      text: '기술',
    },
  ];
  ```

- App.tsx 설정

  본 예제는 App.tsx 로부터 category 상태가 퍼져나가는 식으로 구성했다.

  ```tsx
  function App() {
    const [category, setCategory] = useState<string>('all');
    const onSelect = useCallback((category: string) => {
      setCategory(category);
    }, []);

    return (
      <>
        <CategoryList onSelect={onSelect} category={category} />
        <NewsList category={category} />
      </>
    );
  }
  ```

- CategoryList.tsx

  ```tsx
  function CategoryList({ onSelect, category }: Props) {
    return (
      <CategoryListBlock>
        {categories.map((c) => (
          <Category
            key={c.name}
            active={c.name === category}
            onClick={() => onSelect(c.name)}
          >
            {c.text}
          </Category>
        ))}
      </CategoryListBlock>
    );
  }
  ```

- NewsList.tsx

  ```tsx
  useEffect(() => {
    const fetchData = async () => {
      const query = category === 'all' ? '' : `&category=${category}`;
      setLoading(true);
      try {
        const res = await axios.get<Articles>(
          `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${process.env.REACT_APP_API_KEY}`,
        );
        setArticles(res.data.articles);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, [category]);
  ```

# 7. 리액트 라우터 적용하기

- 이번에는 값을 상태 형식이 아닌, 리액트 라우터를 이용하는 방식으로 값을 관리해보자

## 1. 페이지 설정하기 (NewsPage.tsx)

```tsx
function NewsPage({ match }: RouteComponentProps<Params>) {
  const category = match.params.category || 'all';
  return (
    <>
      <CategoryList />
      <NewsList category={category} />
    </>
  );
}
```

## 2. 라우팅 설정하기 (App.tsx)

```tsx
function App() {
  return <Route path="/:category?" component={NewsPage} />;
}
```

## 3. NavLink 사용하기 (CategoryList.tsx)

```tsx
function CategoryList() {
  return (
    <CategoryListBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          activeClassName="active"
          to={c.name === 'all' ? '/' : `/${c.name}`}
          exact={c.name === 'all'}
        >
          {c.text}
        </Category>
      ))}
    </CategoryListBlock>
  );
}
```

```tsx
const Category = styled(NavLink)<StyleProps>`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  **&.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }
  ** &:hover {
    color: #495057;
  }

  & + & {
    margin-left: 1rem;
  }
`;
```

# 8. usePromise 만들기

```tsx
export default function usePromise<T = any, PR = AxiosResponse<T>>(
  promiseCreator: () => Promise<PR>,
  deps: DependencyList,
): [boolean, PR | null, any] {
  const [loading, setLoading] = useState<boolean>(false);
  const [resolved, setResolved] = useState<PR | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [loading, resolved, error];
}
```

```tsx
function NewsList({ category }: Props) {
  const [loading, response, error] = usePromise<Articles>(() => {
    const query = category === 'all' ? '' : `&category=${category}`;
    return axios.get<Articles>(
      `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${process.env.REACT_APP_API_KEY}`,
    );
  }, [category]);

  if (loading) return <NewsListBlock>대기 중...</NewsListBlock>;

  if (!response) return null;

  if (error) return <NewsListBlock>에러발생!</NewsListBlock>;

  const { articles } = response.data;

  return (
    articles && (
      <NewsListBlock>
        {articles.map((article) => (
          <NewsItem article={article} key={article.url} />
        ))}
      </NewsListBlock>
    )
  );
}
```

- usePromise를 사용하면 해당 컴포넌트에서 대기 중 상태 관리와 useEffect를 직접 설정하지 않아도 되므로 코드가 훨씬 간결해진다.
- 상황에 따라 다음과 같이 customHooks를 만들어 놓으면 좋은 코드를 만들어 갈 수 있다.
