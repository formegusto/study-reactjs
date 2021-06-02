# 리액트 라우터로 SPA 개발하기

# 1. SPA(Single Page Application)

- SPA는 **한 개의 페이지로 이루어진 어플리케이션이라는 의미**이다.
- 기존에는 사용자가 다른 페이지로 이동할 때마다 새로운 html을 받아 오고, 페이지를 로딩할 때마다 서버에서 리소스를 전달받아 해석한 뒤 화면에 보여주었다.

  → 사전에 html 파일을 만들어서 제공하거나, 데이터에 따라 유동적인 html을 생성해 주는 템플릿 엔진을 사용하기도 했다.

  → 요즘은 웹에서 제공되는 정보가 정말 많기 때문에 새로운 화면을 보여 주어야 할 때마다 서버 측에서 모든 뷰를 준비한다면 성능상의 문제가 발생할 수도 있다.

- 리액트 같은 라이브러리 혹은 프레임워크를 사용하여 **뷰 렌더링을 사용자의 브라우저가 담당**하도록 하고, **우선 어플리케이션을 브라우저에 불러와서 실행**시킨 후에 **사용자와의 인터랙션이 발생하면 필요한 부분만 자바스크립트를 사용하여 업데이트** 해준다.

  → 만약 **새로운 데이터가 필요**하다면 **서버 API를 호출하여 필요한 데이터만 새로 불러와 어플리케이션에서 사용**할 수도 있다.

> 싱글 페이지라고 해서 화면이 한 종류이지는 않다.

- SPA의 경우 서버에서 사용자에게 제공하는 페이지는 한 종류이지만, 해당 페이지에서 로딩된 자바스크립트와 현재 사용자 브라우저의 주소 상태에 따라 다양한 화면을 보여 줄 수 있다.

> 다른 주소에 다른 화면을 보여 주는 것을 라우팅이라고 한다.

- 라우팅 기능은 리액트 자체에 내장되어 있지는 않지만, 브라우저의 API를 직접 사용하여 이를 관리하거나 라이브러리를 사용하여 이 작업을 쉽게 구현할 수 있다.
- **리액트 라우팅 라이브러리는 리액트 라우터(react-router), 리치 라우터(reach-router), Next.js 등 여러 가지가 존재**한다.
- 그 중 리액트 라우터는 클라이언트 사이드에서 이루어지는 라우팅을 아주 간단하게 구현할 수 있도록 해준다. 더 나아가서 나중에 서버 사이드 렌더링을 할 때도 라우팅을 도와주는 컴포넌트들을 제공해준다.

## 1. SPA의 단점

> 앱의 규모가 커지면 자바스크립트 파일이 너무 커진다.

- 이는 코드 스플리팅(code splitting)을 사용하면 라우트별로 파일들을 나누어서 트래픽과 로딩 속도를 개선할 수 있다.

> 자바스크립트를 사용하여 라우팅을 관리하는 것은 자바스크립트를 실행하지 않는 일반 크롤러에서는 페이지의 정보를 제대로 수집해 가지 못한다.

- 이는 검색 엔진의 검색 결과에 페이지가 잘 나타나지 않을 수도 있다는 것을 의미한다.
- 구글 검색 엔진에서 사용하는 크롤러의 경우, 자바스크립트를 실행해 주는 기능이 탑재되어 있기는 하지만, 크롤링하는 모든 페이지에서 자바스크립트를 실행하고 있지는 않다.

> 자바스크립트가 실행될 때까지 페이지가 비어 있기 때문에 자바스크립트 파일이 로딩되어 실행되는 짧은 시간 동안 흰 페이지가 나타날 수 있다.

- **해당 문제점들은 나중에 배우게 될 서버 사이드 렌더링(server-side rendering)을 통해 모두 해결가능!**

# 2. Usage

## 1. 프로젝트에 라우터 적용

- yarn add react-router-dom @types/react-router-dom
- index.tsx

  ```tsx
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );
  ```

  프로젝트에 리액트 라우터를 적용할 때는 index 파일에서 react-router-dom에 내장되어 있는 BrowseRouter라는 컴포넌트를 사용하여 감싸면 된다.

  해당 컴포넌트는 **웹 어플리케이션에 HTML5의 History API를 사용하여 페이지를 새로고침하지 않고도 주소를 변경**하고, **현재 주소에 관련된 정보를 props로 쉽게 조회하거나 사용할 수 있도록** 해준다.

## 2. 페이지 만들기

```tsx
import React from "react";

function HomePage() {
  return (
    <div>
      <h1>홈</h1>
      <p>홈, 그 페이지는 가장 먼저 보여지는 페이지.</p>
      <p>ㅋㅋㅋㅋㅋㅋㅋㅋ</p>
    </div>
  );
}

export default HomePage;
```

```tsx
import React from "react";

function AboutPage() {
  return (
    <div>
      <h1>소개</h1>
      <p>react-router-dom은 1910년 영국에서 부터 시작됐으며...</p>
    </div>
  );
}

export default AboutPage;
```

## 3. Route 컴포넌트로 특정 주소에 컴포넌트 연결

- Route 컴포넌트를 사용하여 사용자의 현재 경로에 따라 다른 컴포넌트를 보여 줄 수 있다.

```tsx
<Route path="주소규칙" component={Look} />
```

```tsx
function App() {
  return (
    <div>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
    </div>
  );
}
```

## 4. exact

![image](https://user-images.githubusercontent.com/52296323/120415217-22b91e00-c396-11eb-80ae-ff9d258c879d.png)

- 이는 Route 규칙에 "/about"은 "/" 규칙과 "/about" 규칙에 모두 일치하기 때문에 나타나는 현상이다.
- exact 라는 props를 true로 설정해주면 해당 규칙은 정확하게 맞아 떨어졌을 때만 일치시키게 된다.

```tsx
<Route path="/" component={HomePage} exact={true} />
```

## 5. Link 컴포넌트를 사용하여 다른 주소로 이동하기

- Link 컴포넌트는 **클릭하면 다른 주소로 이동시켜 주는 컴포넌트**이다.
- 일반 웹 어플리케이션에서는 a 태그를 사용하여 페이지를 전환하는데, **리액트 라우터를 사용할 때는 이 태그를 직접 사용하면 안된다.**

  → 이 태그는 **페이지를 전환하는 과정에서 페이지를 새로 불러오기 떄문에 어플리케이션이 들고 있던 상태들을 모두 날려** 버리게 된다.

- Link 컴포넌트를 사용하여 페이지를 전환하면, 페이지를 새로 불러오지 않고 어플리케이션은 그대로 유지한 상태에서 HTML5 History API를 사용하여 페이지의 주소만 변경해준다.
- Link 컴포넌트 자체는 a 태그로 이루어져 있지만, 페이지 전환을 방지하는 기능이 내장되어 있다.

```tsx
<Link to="주소">내용</Link>
```

```tsx
function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <hr />
      <div>
        <Route path="/" component={HomePage} exact={true} />
        <Route path="/about" component={AboutPage} />
      </div>
    </div>
  );
}
```

# 3. Route 하나에 여러 개의 path 설정하기

- Route 하나에 여러 개의 path를 지정(배열형태)하는 것은 최신 버전의 리액트 라우터 v5부터 적용된 기능

```tsx
<Route path={["/about", "/info"]} component={AboutPage} />
```

# 4. URL 파라미터와 쿼리

- 페이지 주소를 정의할 때, 가끔은 유동적인 값을 전달해야 할 때도 있다. 이는 파리미터와 쿼리로 나눌 수 있다.
  - parameter exam : /profiles/iamformegusto
  - query exam : /about?detail=true
- 일반적으로 파라미터는 특정 아이디 혹은 이름을 사용하여 조회할 때 사용하고, 쿼리는 우리가 어떤 키워드를 검색하거나 페이지에 필요한 옵션을 전달할 때 사용한다.

## 0. RouteComponentProps

```tsx
export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
> {
  history: H.History<S>;
  location: H.Location<S>;
  match: match<Params>;
  staticContext?: C;
}
```

## 1. URL 파라미터

```tsx
function ProfilePage({ match }: RouteComponentProps<Parameter>) {
  const { username } = match.params;
  const profile = data[username];

  return profile ? (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
    </div>
  ) : (
    <div>존재하지 않는 사용자입니다.</div>
  );
}
```

- URL 파라미터를 사용할 때는 **라우트로 사용되는 컴포넌트에서 받아 오는 match 라는 객체 안에 params 값을 참조**한다. match 객체 안에는 현재 컴포넌트가 어떤 **경로 규칙**에 의해 보이는지에 대한 정보가 들어있다.

```tsx
function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/profile/iamformegusto">formegusto profile</Link>
        </li>
        <li>
          <Link to="/profile/mike">mike profile</Link>
        </li>
      </ul>
      <hr />
      <div>
        <Route path="/profile/:username" component={ProfilePage} />
      </div>
    </div>
  );
}
```

- /profile/:param 을 통해 match.params 에서 해당 param 네이밍을 조회할 수 있다.

## 2. URL 쿼리

- 쿼리는 location 객체에 들어 있는 search 값에서 조회할 수 있다. location 객체는 라우트로 사용된 컴포넌트에게 props로 전달되며, 웹 어플리케이션의 현재 주소에 대한 정보를 지니고 있다.

```json
// http://localhost:3000/about?detail=true
{
  "pathname": "/about",
  "search": "?detail=true",
  "hash": ""
}
```

- 이 때, 우리는 search 프로퍼티에 있는 값을 읽어와야 하는데 이 문자열을 객체 형태로 쉽게 변환해주는 라이브러리가 있다.

> yarn add qs @types/qs

```tsx
function AboutPage({ location }: RouteComponentProps) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true, // 맨 앞의 ?를 생략하는 옵션
  }) as Query;
  const showDetail = query.detail === "true";

  return (
    <div>
      <h1>소개</h1>
      <p>react-router-dom은 1910년 영국에서 부터 시작됐으며...</p>
      {showDetail && <p>detail 내용이 더 없는 거는 모순입니다.</p>}
    </div>
  );
}
```

- 쿼리를 사용할 때는 쿼리 문자열은 객체로 파싱하는 과정에서 결과 값은 언제나 문자열이라는 점에 주의

# 5. 서브 라우트

- 서브 라우트는 라우트 내부에 또 라우트를 정의하는 것을 의미한다.
- 이 작업은 라우트로 사용되고 있는 컴포넌트 내부에 Route 컴포넌트를 또 사용하면 된다.

```tsx
function ProfilesPage() {
  return (
    <div>
      <h3>사용자 목록</h3>
      <ul>
        <li>
          <Link to="/profiles/iamformegusto">formegusto profile</Link>
        </li>
        <li>
          <Link to="/profiles/mike">mike profile</Link>
        </li>
      </ul>
      <div>
        <Route
          path="/profiles"
          component={() => <div>사용자를 선택해주세요.</div>}
          exact
        />
        <Route path="/profiles/:username" component={ProfilePage} />
      </div>
    </div>
  );
}
```

> Tip. JSX 내에서 props를 설정할 때 값을 생략하면 자동으로 true로 설정한다.

# 6. 리액트 라우터 부가 기능

## 1. history

- history 객체는 라우트로 사용된 컴포넌트에 match, location과 함께 전달되는 props 중 하나이다. 이 객체를 통해 컴포넌트 내에 구현하는 메서드에서 라우터 API를 호출할 수 있다.
- 특정 버튼을 눌렀을 때 뒤로 가거나, 로그인 후 화면을 전환하거나, 다른 페이지로 이탈하는 것을 방지해야 할 때 사용한다.

```tsx
function HistoryPage({ history }: RouteComponentProps) {
  useEffect(() => {
    // 마운트때 history.block 을 설정해두면,
    const unblock = history.block("정말 떠나실 건가요?");
    return () => {
      // 페이지를 벗어나려고 할 때마다 질문을 한다.
      unblock();
    };
  });

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoHome = () => {
    history.push("/");
  };

  return (
    <div>
      <button onClick={handleGoBack}>뒤로</button>
      <button onClick={handleGoHome}>홈으로</button>
    </div>
  );
}
```

## 2. withRouter

- HoC(Higher-order Component) 함수로, 라우트로 사용된 컴포넌트가 아니어도 match, location, history 객체에 접근할 수 있게 해준다.

```tsx
function WithRouterPage(props: RouteComponentProps) {
  return (
    <div>
      <h4>location</h4>
      <textarea
        value={JSON.stringify(props.location, null, 2)}
        rows={7}
        readOnly={true}
      />
      <h4>match</h4>
      <textarea
        value={JSON.stringify(props.match, null, 2)}
        rows={7}
        readOnly={true}
      />
      <button onClick={() => props.history.push("/")}>홈으로</button>
    </div>
  );
}

export default withRouter(WithRouterPage);
```

```tsx
function ProfilesPage() {
  return (
    <div>
      <WithRouterPage />
    </div>
  );
}
```

- 이 때, match 객체의 params가 비어있는 것을 확인할 수 있다.
- withRouter를 사용하면 현재 자신을 보여주고 있는 라우트 컴포넌트 기준으로 match가 전달된다.
- ProfilesPage를 위한 라우트를 설정할 때는 path="/profiles"라고만 입력했으므로, username 파라미터를 읽어 오지 못하는 상태이다.

```tsx
function ProfilePage({ match }: RouteComponentProps<Parameter>) {
  const { username } = match.params;
  const profile = data[username];

  return profile ? (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
      <WithRouterPage />
    </div>
  ) : (
    <div>존재하지 않는 사용자입니다.</div>
  );
}
```

## 3. Switch

- Switch 컴포넌트는 여러 Route를 감싸서 그중 일치하는 단 하나의 라우트만을 렌더링시켜 준다.
- Switch 컴포넌트를 사용하면 모든 규칙과 일치하지 않을 때 보여 줄 Not Found 페이지도 구현할 수 있다.

```tsx
<Switch>
  <Route path="/" component={HomePage} exact={true} />
  <Route path={["/about", "/info"]} component={AboutPage} />
  <Route path="/history" component={HistoryPage} />
  <Route path="/profiles" component={ProfilesPage} />
  <Route // path를 따로 정의하지 않으면 모든 상황에 렌더링된다.
    render={({ location }) => (
      <div>
        <h2>이 페이지는 존재하지 않습니다.</h2>
        <p>{location.pathname}</p>
      </div>
    )}
  />
</Switch>
```

## 4. NavLink

- 현재 경로와 Link에서 사용하는 경로가 일치하는 경우 특정 스타일 혹은 CSS 클래스를 적용할 수 있는 컴포넌트이다.
- 링크가 활성화되었을 때의 스타일을 적용할 때는 activeStyle 값을, CSS 클래스를 적용할 때는 activeClassName 값을 props로 넣어 주면 된다.

```tsx
function ProfilesPage() {
  const activeStyle: CSSProperties = {
    backgroundColor: "#000",
    color: "#FFF",
  };

  return (
    <div>
      <h3>사용자 목록</h3>
      <ul>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/iamformegusto">
            formegusto profile
          </NavLink>
        </li>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/mike">
            mike profile
          </NavLink>
        </li>
      </ul>
      <div>
        <Route
          path="/profiles"
          component={() => <div>사용자를 선택해주세요.</div>}
          exact
        />
        <Route path="/profiles/:username" component={ProfilePage} />
      </div>
    </div>
  );
}
```

# 7. 정리

- 큰 규모의 프로젝트를 진행하다 보면 문제가 발생한다. 바로 웹 브라우저에서 사용할 컴포넌트, 상태 관리를 하는 로직, 그 외 여러 기능을 구현하는 함수들이 점점 쌓이면서 최종 결과물인 자바스크립트 파일의 크기가 매우 커진다는 점이다.
- 예를 들어 위의 예제는 사용자가 /about 페이지에 들어왔을 때, 지금 당장 필요하지 않은 Profile 컴포넌트까지 불러온다는 것이다.
- 라우트에 따라 필요한 컴포넌트만 불러오고, 다른 컴포넌트는 다른 페이지를 방문하는 등의 필요한 시점에 불러오면 더 효율적이지 않을까? 이를 해결해주는 기술이 바로 코드 스플리팅이다.
