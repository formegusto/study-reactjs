# 20_react-router-dom

# References

[React Router: Declarative Routing for React](https://reactrouter.com/core/guides/quick-start)

# 1. Basic

```tsx
<Router>
  <div>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
    </ul>
  </div>
  <hr />
  <Switch>
    <Route path="/" exact>
      Home Page
    </Route>
    <Route path="/about">About Page</Route>
    <Route path="/dashboard">Dashboard Page</Route>
  </Switch>
</Router>
```

- BrowserRouter as Router
- Switch Component안에 Route Component를 통해 렌더링할 요소의 URL을 넣어준다.
- Switch Component는 다중 라우터 설정도 가능하다.

# 2. URL Parameters

```tsx
function Child() {
  const { id } = useParams<{ id: string }>();

  return <h1>{id}</h1>;
}

function Params() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/노태헌">노태헌</Link>
        </li>
        <li>
          <Link to="/김태헌">김태헌</Link>
        </li>
      </ul>

      <Switch>
        <Route path="/:id" component={Child} />
      </Switch>
    </Router>
  );
}
```

- Params는 :(colon)과 함께 시작되는 URL 이다.
- 우리는 useParams hook을 통하여 직접적으로 URL에 접근할 수 있다.

# 3. Nesting

```tsx
function Nesting() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path="/">
          Home Page
        </Route>
        <Route path="/topics">
          <Topics />
        </Route>
      </Switch>
    </Router>
  );
}

function Topics() {
  const { path, url } = useRouteMatch();
  return (
    <div>
      <h2>Topcis</h2>
      <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering With React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v.state</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic />
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  const { topicId } = useParams<{ topicId: string }>();
  return <h4>{topicId}</h4>;
}
```

- useRouteMatch 는 RouteProps의 matches를 가지고 올 수 있는 hook이다.

  → path, url 의 차이점은 path는 우리가 Route path에 기입해 준 path가 들어오고 url은 순수 url이 들어온다.

  ```
  path: /topics url: /topics
  path: /topics/:topicId url: /topics/components
  ```

  → path와 url은 중첩 라우팅에서, 자신의 라우팅만 조회할 수 있다.

# 4. Redirect(Auth)

## 1. 예제를 위한 AuthContext 정의

```tsx
const authStore = {
  isAuthenticated: false,
  signin: (cb: (...args: any) => void) => {
    authStore.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout: (cb: (...args: any) => void) => {
    authStore.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const authContext = createContext<ReturnType<typeof useProvideAuth> | null>(
  null
);

function AuthProvider({ children }: React.PropsWithChildren<any>) {
  const value = useProvideAuth();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
```

### 1. useProviderAuth

```tsx
function useProvideAuth() {
  const [user, setUser] = useState<string | null>(null);

  const signin = (cb: (...args: any) => void) => {
    return authStore.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = (cb: (...args: any) => void) => {
    return authStore.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout,
  };
}
```

- 유저의 정보를 담고, authStore의 변화를 일으켜줄 hooks

### 2. useAuth

```tsx
function useAuth() {
  return useContext(authContext);
}
```

- authContext를 이용할 수 있게 해주는 hooks

## 2. Components

### 1. AuthExample

```tsx
function AuthExample() {
  return (
    <AuthProvider>
      <Router>
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route path="/public">Public Page</Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute path="/protected">Protected Page</PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
```

### 2. AuthButton

```tsx
function AuthButton() {
  const history = useHistory();
  const auth = useAuth();

  return auth!.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth!.signout(() => history.push("/"));
        }}
      >
        SignOut
      </button>
    </p>
  ) : (
    <p>로그인하셔야함</p>
  );
}
```

- authContext 에서 auth 정보를 가지고 오고, 액션들도 가져온다. 로그인 되어 있는 상태라면 로그아웃 버튼을 보여주고, 로그인이 안 되어 있는 상태라면 로그인을 알린다.

### 3. PrivateRoute

```tsx
function PrivateRoute({ children, ...rest }: React.PropsWithChildren<any>) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth!.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
```

- 로그인이 되어 있는 상태라면 Private Page를 보여주고, 아니라면 로그인 페이지로 리다이렉트 시킨다. 해당 예제의 핵심은 react-router-dom의 Redirect Component의 사용법이다.

### 4. LoginPage

```tsx
function LoginPage() {
  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();
  const auth = useAuth();

  const { from } = location.state || { from: { pathname: "/" } };
  const login = () => {
    auth!.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}
```

## 3. Redirect Component

```tsx
export class Redirect extends React.Component<RedirectProps, any> {}

export interface RedirectProps {
  to: H.LocationDescriptor;
  push?: boolean | undefined;
  from?: string | undefined;
  path?: string | undefined;
  exact?: boolean | undefined;
  strict?: boolean | undefined;
}

export interface LocationDescriptorObject<S = LocationState> {
  pathname?: Pathname | undefined;
  search?: Search | undefined;
  state?: S | undefined;
  hash?: Hash | undefined;
  key?: LocationKey | undefined;
}
```

- Redirect Component는 to props가 핵심이 된다. redirect를 할 컴포넌트를 설정할 수 있으며(pathname), state에 redirect 되는 컴포넌트에 어떠한 상태를 전달 시킬 수도 있다(state). 그래서 아래와 같은 코드들이 등장한 것 이다.

```tsx
<Route
  {...rest}
  render={({ location }) =>
    auth!.user ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location },
        }}
      />
    )
  }
/>;

//////

function LoginPage() {
  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();
  const auth = useAuth();

  const { from } = location.state || { from: { pathname: "/" } };
  const login = () => {
    auth!.signin(() => {
      history.replace(from);
    });
  };
  // *** //
}
```

- 로그인이 안 되어 있는 사용자를 login page로 redirect 시켜버리는데, 이 때, Redirect Component에서 설정해준 state의 from에 location이 담겨져서 간다.
- 그래서 Login Page Component 에서 location.state를 조회하는 로직이 생긴 것이다. 로그인 성공 후 이전 Protected Page로 이동시키기 위한 작업인 것 이다.

# 5. CustomLink

## 1. 예제 Component

```tsx
export default function CustomLinkExample() {
  return (
    <Router>
      <div>
        <OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home" />
        <OldSchoolMenuLink to="/about" label="About" />

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
```

## 2. Custom Link

```tsx
function OldSchoolMenuLink({ label, to, activeOnlyWhenExact }: Props) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <div className={match ? "active" : ""}>
      {match && "> "}
      <Link to={to}>{label}</Link>
    </div>
  );
}
```

## 3. useRouteMatch

> The useRouteMatch hook attempts to match the current URL in the same way that a <Route> would. It’s mostly useful for getting access to the match data without actually rendering a <Route>.

- useRouteMatch는 URL과의 일치를 파악할 때 주로 쓰인다.
- 위 예제를 보면 객체에 두 개의 프로퍼티를 넘기는데, path는 현재 path와 matching url을 비교하는 것 이다. exact는 path와 to가 완전히 일치할 때만 match 객체를 만들어주는 느낌으로 쓰인다. 그래서 다음과 같이 Link Custom이 가능한 것이다. url 매칭을 통하여 match 객체가 undefined가 아닌, 존재하는 객체로 넘어왔을 때 activeLink를 만들도록 한 것 이다.

# 6. Preventing Transitions

```tsx
function BlockingForm() {
  let [isBlocking, setIsBlocking] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        (event.target as HTMLFormElement).reset();
        setIsBlocking(false);
      }}
    >
      <Prompt
        when={isBlocking}
        message={(location) =>
          `Are you sure you want to go to ${location.pathname}`
        }
      />

      <p>
        Blocking? {isBlocking ? "Yes, click a link or the back button" : "Nope"}
      </p>

      <p>
        <input
          placeholder="type something to block transitions"
          onChange={(event) => {
            setIsBlocking(event.target.value.length > 0);
          }}
          style={{
            width: "150px",
          }}
        />
      </p>

      <p>
        <button>Submit to stop blocking</button>
      </p>
    </form>
  );
}
```

- react-route-dom 은 v4 이후부터 Prompt Component를 지원해주고 있다. 이 컴포넌트는 페이지 이동 시 확인창 모달을 띄어주는 기능을 한다.

# 7. No Match (404)

```tsx
<Switch>
  <Route exact path="/">
    <Home />
  </Route>
  <Route path="/old-match">
    <Redirect to="/will-match" />
  </Route>
  <Route path="/will-match">
    <WillMatch />
  </Route>
  <Route path="*">
    <NoMatch />
  </Route>
</Switch>
```

- Route Component의 path 값을 \*로 잡으면 아무것도 match 되는 path가 없을 때의 컴포넌트를 렌더링 시킨다.

# 8. Recursive Paths

## 1. Example Store

```tsx
const PEEPS = [
  { id: 0, name: "Michelle", friends: [1, 2, 3] },
  { id: 1, name: "Sean", friends: [0, 3] },
  { id: 2, name: "Kim", friends: [0, 1, 3] },
  { id: 3, name: "David", friends: [1, 2] },
];

function find(id: number) {
  return PEEPS.find((p) => p.id === id);
}
```

## 2. Example Component

```tsx
export default function RecursiveExample() {
  return (
    <Router>
      <Switch>
        <Route path="/:id">
          <Person />
        </Route>
        <Route path="/">
          <Redirect to="/0" />
        </Route>
      </Switch>
    </Router>
  );
}

function Person() {
  let { url } = useRouteMatch();
  let { id } = useParams<{ id: string }>();
  let person = find(parseInt(id));

  return (
    <div>
      <h3>{person!.name}’s Friends</h3>

      <ul>
        {person!.friends.map((id) => (
          <li key={id}>
            <Link to={`${url}/${id}`}>{find(id)!.name}</Link>
          </li>
        ))}
      </ul>

      <Switch>
        <Route path={`${url}/:id`}>
          <Person />
        </Route>
      </Switch>
    </div>
  );
}
```

- 첫 Person Component를 기준으로 퍼티즌 구조이다.
- Route path `${url}/:id` 선언으로, 현재 url에서 밑으로 계속해서 퍼질수 있도록 구조화했다.

# 9. Side Bar

## 1. routes 변수 설정

```tsx
const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>,
  },
  {
    path: "/bubblegum",
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>,
  },
  {
    path: "/shoelaces",
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>,
  },
];
```

- 다음과 같이 sidbar에 active시 띄울 컴포넌트와 main에 active시 띄울 컴포넌트를 정의해둔다.

## 2. Sidebar 설정

```tsx
<ul style={{ listStyleType: "none", padding: 0 }}>
  {routes.map((route, index) => (
    <li>
      <Link to={route.path}>{route.name}</Link>
    </li>
  ))}
</ul>
<Switch>
  {routes.map((route, index) => (
    // You can render a <Route> in as many places
    // as you want in your app. It will render along
    // with any other <Route>s that also match the URL.
    // So, a sidebar or breadcrumbs or anything else
    // that requires you to render multiple things
    // in multiple places at the same URL is nothing
    // more than multiple <Route>s.
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      children={<route.sidebar />}
    />
  ))}
</Switch>
```

## 3. Main Screen 설정

```tsx
<div style={{ flex: 1, padding: "10px" }}>
  <Switch>
    {routes.map((route, index) => (
      // Render more <Route>s with the same paths as
      // above, but different components this time.
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        children={<route.main />}
      />
    ))}
  </Switch>
</div>
```

# **10. Animated Transition \*\*\***

- 원래 해당 스터디의 목적은 이거였으나, 봤더니 react-transition-group 이라는 라이브러리를 이용해서 다른 챕터에서 animation을 제대로 다루도록 하겠다.

[React Transition Group](https://reactcommunity.org/react-transition-group/)

[React hero animations | React Motion Layout](http://motion-layout.com/)

## 1. Transition Group, CSSTransition

```tsx
<TransitionGroup>
  {/*
    This is no different than other usage of
    <CSSTransition>, just make sure to pass
    `location` to `Switch` so it can match
    the old location as it animates out.
  */}
  <CSSTransition key={location.key} classNames="fade" timeout={300}>
    <Switch location={location}>
      <Route path="/hsl/:h/:s/:l" children={<HSL />} />
      <Route path="/rgb/:r/:g/:b" children={<RGB />} />
    </Switch>
  </CSSTransition>
</TransitionGroup>
```

- 라우트에 css transition을 적용시킬 경우, key값을 부여해줘야 한다.
- 그러면 아래에 따라와서 렌더링 되는 라우팅 key를 매칭 후 해당 transition이 적용된다.

  → 사실 잘 모르겠다 다음에 알게되면 수정하겠다.

# 11. Route Config

## 1. Route 객체 배열 설정

```tsx
type RouteType = {
  path: string;
  component: (...props: any) => JSX.Element;
  routes?: RouteType[];
};

const routes: RouteType[] = [
  {
    path: "/sandwiches",
    component: Sandwiches,
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus,
      },
      {
        path: "/tacos/cart",
        component: Cart,
      },
    ],
  },
];
```

## 2. SubRoutes Component

```tsx
function RouteWithSubRoutes(route: RouteType) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
```

- 다음과 같이 render 함수라는 것을 이용해서도 만들 수 있다는 것을 보여주는 것 같다. Route Props를 고스란히 넘겨주면서 위가 가능해진다.

# 12. Modal Gallery

- 지정된 element를 state true false가 아닌, navigation 방식으로 modal을 띄우는 방식이다.
- 해당 방식은 후에 hero animation의 토대가 된다. 아마도... ㅋ

## 1. Navigation

```tsx
let background = location.state && location.state.background;

return (
  <div>
    <Switch location={background || location}>
      <Route exact path="/" children={<Home />} />
      <Route path="/gallery" children={<Gallery />} />
      <Route path="/img/:id" children={<ImageView />} />
    </Switch>

    {/* Show the modal when a background page is set */}
    {background && <Route path="/img/:id" children={<Modal />} />}
  </div>
);
```

## 2. Atoms

> ImageView

```tsx
function ImageView() {
  let { id } = useParams();
  let image = IMAGES[parseInt(id, 10)];

  if (!image) return <div>Image not found</div>;

  return (
    <div>
      <h1>{image.title}</h1>
      <Image color={image.color} />
    </div>
  );
}
```

> Modal

```tsx
function Modal() {
  let history = useHistory();
  let { id } = useParams();
  let image = IMAGES[parseInt(id, 10)];

  if (!image) return null;

  let back = (e) => {
    e.stopPropagation();
    history.goBack();
  };

  return (
    <div
      onClick={back}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        className="modal"
        style={{
          position: "absolute",
          background: "#fff",
          top: 25,
          left: "10%",
          right: "10%",
          padding: 15,
          border: "2px solid #444",
        }}
      >
        <h1>{image.title}</h1>
        <Image color={image.color} />
        <button type="button" onClick={back}>
          Close
        </button>
      </div>
    </div>
  );
}
```

> Thumbnail

```tsx
function Thumbnail({ color }) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        background: color,
      }}
    />
  );
}
```

> Image

```tsx
function Image({ color }) {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: color,
      }}
    />
  );
}
```

## 3. Screen

> Home

```tsx
function Home() {
  return (
    <div>
      <Link to="/gallery">Visit the Gallery</Link>
      <h2>Featured Images</h2>
      <ul>
        <li>
          <Link to="/img/2">Tomato</Link>
        </li>
        <li>
          <Link to="/img/4">Crimson</Link>
        </li>
      </ul>
    </div>
  );
}
```

> Gallery

```tsx
function Gallery() {
  let location = useLocation();

  return (
    <div>
      {IMAGES.map((i) => (
        <Link
          key={i.id}
          to={{
            pathname: `/img/${i.id}`,
            // This is the trick! This link sets
            // the `background` in location state.
            state: { background: location },
          }}
        >
          <Thumbnail color={i.color} />
          <p>{i.title}</p>
        </Link>
      ))}
    </div>
  );
}
```

> Navigation

```tsx
function ModalSwitch() {
  let location = useLocation();

  // This piece of state is set when one of the
  // gallery links is clicked. The `background` state
  // is the location that we were at when one of
  // the gallery links was clicked. If it's there,
  // use it as the location for the <Switch> so
  // we show the gallery in the background, behind
  // the modal.
  let background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route exact path="/" children={<Home />} />
        <Route path="/gallery" children={<Gallery />} />
        <Route path="/img/:id" children={<ImageView />} />
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/img/:id" children={<Modal />} />}
    </div>
  );
}
```

- 해당 예제는 Switch Component의 location props를 이용한 것으로 볼 수 있다.
- Switch에 location Props를 지정해주면 하위 Route Component에 해당 location 객체를 전달해준다.
- 결론적으로는 /img/:id 라는 path가 두개가 지정이 되어 있지만, 두 개의 이동방식이 다른 점은 Home에서 이동할 때는 state를 전달하지 않고, Gallery에서 이동할 때는 state를 Gallery 자신의 location object를 보내준다.
- 때문에 ModalSwitch 에서는 state로 전달된 location 객체 안에 pathname이 gallery로 잡혀있기 때문에 Gallery 페이지를 그대로 띄우고 있게 되고, ImageView Component가 나타나지 않고, 하위에 Modal Component가 등장을 하게 되는 원리이다.

# 13. Query Parameter

```tsx
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function QueryParamsDemo() {
  let query = useQuery();

  return (
    <div>
      <div>
        <h2>Accounts</h2>
        <ul>
          <li>
            <Link to="/account?name=netflix">Netflix</Link>
          </li>
          <li>
            <Link to="/account?name=zillow-group">Zillow Group</Link>
          </li>
          <li>
            <Link to="/account?name=yahoo">Yahoo</Link>
          </li>
          <li>
            <Link to="/account?name=modus-create">Modus Create</Link>
          </li>
        </ul>

        <Child name={query.get("name")} />
      </div>
    </div>
  );
}
```

- Query는 url path 후에 ?(물음표)로 시작하는 형식을 말한다.
- react-router-dom에서는 useLocation()의 search 객체로 해당 내용을 가지고 올 수 있다.
