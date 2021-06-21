# 18\_서버 사이드 렌더링

# 1. 서버 사이드 렌더링의 이해

- 서버 사이드 렌더링은 UI를 서버에서 렌더링하는 것을 의미한다. 앞에서 만든 리액트 프로젝트는 기본적으로 클라이언트 사이드 렌더링을 하고 있다.
- 즉, UI 렌더링을 브라우저에서 모두 처리하는 방식이다. 즉, 자바스크립트를 실행해야 우리가 만든 화면이 사용자에게 보인다.
- 일반적으로 create react-app 으로 프로젝트를 생성하고 실행해보면, 맨 처음 실행 당시에는 root 엘리먼트의 내용이 비어있는 것을 볼 수 있다. 즉, 이 페이지는 빈 페이지라는 것이고, 그 이후에 자바스크립트가 실행되고 리액트 컴포넌트가 렌더링되면서 우리에게 보이는 것이다.
- **서버 사이드 렌더링을 구현하면 사용자가 웹 서비스에 방문했을 때, 서버 쪽에서 초기 렌더링을 대시해 준다. 그리고 사용자가 html을 전달받을 때, 그 내부에 렌더링된 결과물이 보인다.**

## 1. 서버 사이드 렌더링의 장점

1. 구글, 네이버, 다음 등의 검색 엔진이 우리가 만든 웹 어플리케이션의 페이지를 원활하게 수집할 수 있다.

   리액트로 만든 SPA는 검색 엔진 크롤러 봇처럼 자바스크립트가 실행되지 않는 환경에서는 페이지가 제대로 나타지 않는다. 따라서 서버에서 클라이언트 대신 렌더링을 해 주변 검색 엔진이 페이지의 내용을 제대로 수집해 갈 수 있다.

   웹 서비스의 검색 엔진 최적화를 위해서라면 서버 사이드 렌더링을 구현해주는 것이 좋다.

2. 초기 렌더링 성능을 개선할 수 있다. 서버 사이드 렌더링을 구현한 웹 페이지는 자바스크립트 파일 다운로드가 완료되지 않은 시점에서도 html상에 사용자가 볼 수 있는 콘텐츠가 있기 때문에 대기 시간이 최소화되고, 이로 인해 사용자 경험도 향상된다.

## 2. 서버 사이드 렌더링의 단점

1. 서버 리소스가 사용된다.

   사용자가 몰려서 서버에 과부하가 발생할 수도 있는다. 그래서 사용자가 많은 서비스라면 캐싱과 로드 밸런싱을 통해 성능을 최적화해야 한다.

2. 프로젝트 구조가 좀 더 복잡해질 수 있다.

   데이터 미리 불러오기, 코드 스플리팅과의 호환 등 고려해야 할 사항이 더 많아져서 개발이 어려워질 수도 있다.

## 3. 서버 사이드 렌더링과 코드 스플리팅 충돌

- 서버 사이드 렌더링과 코드 스플리팅을 함께 적용하면 작업이 꽤 까다롭다. 별도의 호환 작업 없이 두 기술을 함께 적용하면, 페이지에 깜박임이 발생한다.
  1. 서버사이드 렌더링된 결과물이 브라우저에 나타남
  2. 자바스크립트 파일 로딩 시작
  3. 자바스크립트가 실행되면서 아직 불러오지 않은 컴포넌트를 null로 렌더링함
  4. 페이지에서 코드 스플리팅된 컴포넌트들이 사라짐
  5. 코드 스플리팅된 컴포넌트들이 로딩된 이후 제대로 나타남
  - 이러한 이슈를 해결하려면 라우트 경로마다 코드 스플리팅된 파일 중에서 필요한 모든 파일을 브라우저에서 렌더링하기 전에 미리 불러와야 한다.
  - 해당 챕터에서는 Loadable Components 라이브러리에서 제공하는 기능을 써서 서버 사이드 렌더링 후 필요한 파일의 경로를 추출하여 렌더링 결과에 스크립트/스타일 태그를 삽입해 주는 방법이다.

# 2. 서버 사이드 렌더링 구현하기

- 서버 사이드 렌더링을 구현하려면 웹팩 설정을 커스터마이징 해 주어야 한다. CRA로 만든 프로젝트에서는 웹팩 관련 설정이 기본적으로 모두 숨겨져 있으니 yarn eject 명령어를 통해 밖으로 꺼내 주자.

## 1. 서버 사이드 렌더링용 엔트리 만들기

- 엔트리(entry)는 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일이다. 예를 들어 현재 작성 중인 리액트 프로젝트에서는 index.js를 엔트리 파일로 사용한다.
- 서버 사이드 렌더링을 할 때는 서버를 위한 엔트리 파일을 따로 생성해야 한다.
- index.server.tsx

  ```tsx
  import React from "react";
  import ReactDOMServer from "react-dom/server";

  const html = ReactDOMServer.renderToString(
    <div>Hello Server Side Rendering!</div>
  );

  console.log(html);
  ```

## 2. 서버 사이드 렌더링 전용 웹팩 환경 설정 작성하기

- 작성한 엔트리 파일을 웹팩으로 불러와서 빌드하려면 서버 전용 환경 설정을 만들어 주어야 한다.
- config/paths.js (수정)

  ```jsx
  // config after eject: we're in ./config/
  module.exports = {
    // (...)
    publicUrlOrPath,
    ssrIndex: resolveApp("src/index.server.tsx"), // 서버 사이드 렌더링 엔트리
    ssrBuild: resolveApp("dist"), // 웹팩 처리 후 저장 경로
  };
  ```

- config/webpack.config.server.js (작성 - 기본 설정)

  ```jsx
  const paths = require("./paths");

  module.exports = {
    mode: "production", // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
    entry: paths.ssrIndex, // 엔트리 경로
    target: "node", // node 환경에서 실행될 것이라는 점을 명시
    output: {
      path: paths.ssrBuild, // 빌드 경로
      filename: "server.js", // 파일 이름
      chunkFilename: "js/[name].chunk.js", // 청크 파일 이름
      publicPath: paths.publicUrlOrPath, // 정적 파일이 제공될 경로
    },
  };
  ```

  - 빌드할 때 어떤 파일에서 시작해 파일들을 불러오는지, 또 어디에 결과물을 저장할지를 정해준다.

- config/webpack.config.server.js (작성 - 로더 설정)

  - 웹팩의 로더는 파일을 불러올 때 확장자에 맞게 필요한 처리를 해준다.
  - 예를 들어 자바스크립트는 babel을 사용하여 트랜스파일링을 해 주고, CSS는 모든 CSS 코드를 결합해주고, 이미지 파일은 다른 경로에 따로 저장하고, 그 파일에 대한 경로를 자바스크립트에서 참조할 수 있게 해준다.

  ```jsx
  const config = {
  	// (...)
    module: {
      rules: [
        {
          oneOf: [
            // 자바스크립트를 위한 처리
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve(
                  "babel-preset-react-app/webpack-overrides"
                ),
                presets: [[require.resolve("babel-preset-react-app")]],
                plugins: [
                  [
                    require.resolve("babel-plugin-named-asset-import"),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                        },
                      },
                    },
                  ],
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: false,
              },
            },
          // (...)
      ],
    },
  };
  ```

  - 서버 사이드 렌더링을 할 때, CSS 혹은 이미지 파일은 그다지 중요하지 않다. 그렇다고 완전히 무시할 수는 없다. 가끔 자바스크립트 내부에서 파일에 대한 경로가 필요하거나 CSS Module 처럼 로컬 className을 참조해야 할 수도 있기 때문이다. 그래서 해당 파일을 로더에서 별도로 설정하여 처리하지만 따로 결과물에 포함되지 않도록 구현할 수 있다.

- config/webpack.config.server.js (작성 - 내부 모듈)

  ```jsx
  const config = {
    // (...)
    resolve: {
      modules: ["node_modules"],
      extensions: [".css", ".ts", ".tsx"],
    },
    // (...)
  };
  ```

  - 이렇게 설정해두면, react, react-dom/server 같은 라이브러리를 import 구문으로 불러오면 node_modules에서 찾아 사용한다. 라이브러리를 불러오면 빌드할 때, 결과물 파일 안에 해당 라이브러리 관련 코드가 함께 번들링된다.
  - 브라우저에서 사용할 때는 결과물 파일에 리액트 라이브러리와 우리의 어플리케이션에 관한 코드가 공존해야 하는데, 서버에서는 굳이 결과물 파일 안에 리액트 라이브러리가 들어 있지 않아도 된다. node_modules에서 불러오면 되기 때문이다.
  - 추가적으로 ts, tsx 파일을 import 하기 위한 extensions 설정도 함께 넣어준다.

- config/webpack.config.server.js (작성 - node externals)

  - yarn add webpack-node-externals

  ```jsx
  const nodeExternals = require("webpack-node-externals");

  const config = {
    // (...)
    externals: [nodeExternals()],
  };
  ```

  - webpack-node-externals 는 webpack의 번들링 과정에서 외부 모듈(라이브러리)를 제외할 수 있게 해주는 라이브러리이다.
  - 순수하게 내가 작성한 파일의 라이브러리들만 import 하기 위해서 사용한다.

- config/wepack.config.serer.js (작성 - 환경변수 주입)

  ```jsx
  const webpack = require("webpack");
  const getClientEnvironment = require("./env");
  const publicUrl = paths.publicUrlOrPath.slice(0, -1);
  const env = getClientEnvironment(publicUrl);

  // (...)
  const config = {
    // (...)
    externals: [nodeExternals(), new webpack.DefinePlugin(env.stringified)], // 환경변수를 주입해준다.],
  };

  module.exports = config;
  ```

## 3. 빌드 스크립트 작성하기

- 웹팩으로 빌드하는 스크립트 작성하기
- build.server.js

  ```jsx
  process.env.BABEL_ENV = "production";
  process.env.NODE_ENV = "production";

  process.on("unhandledRejection", (err) => {
    throw err;
  });

  require("../config/env");
  const fs = require("fs-extra");
  const webpack = require("webpack");
  const config = require("../config/webpack.config.server");
  const paths = require("../config/paths");

  function build() {
    console.log("Creating server build...");
    fs.emptyDirSync(paths.ssrBuild);
    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(stats.toString());
      });
    });
  }

  build();
  ```

  - 해당 파일은 클라이언트에서 사용할 빌드 파일을 만드는 작업을 한다.

- 빌드하기

  ```
  node scripts/build.server.js
  ```

- 빌드파일 확인

  ```
  node dist/server.js
  // <div data-reactroot="">Hello Server Side Rendering</div>
  ```

## 4. 서버 코드 작성하기

- 서버 사이드 렌더링을 처리할 서버를 작성해보자. Express 라는 Node.js 웹 프레임워크를 사용하여 웹 서버를 만들도록 하자.
  - Express 말고도 Koa, Hapi 또는 connect 라이브러리를 사용하면 구현할 수 있다.
  - Express 를 예제에서 사용하는 이유는 사용률이 높고, 추후 정적 파일들을 호스팅할 때도 쉽게 구현할 수 있기 때문이다.
- index.server.tsx

  ```tsx
  import React, { ReactElement } from "react";
  import ReactDOMServer from "react-dom/server";
  import express from "express";
  import { StaticRouter } from "react-router-dom";
  import SecondApp from "./SecondApp";

  const app = express();

  const serverRender = (req: any, res: any, next: any) => {
    const context = {};
    const jsx: ReactElement = (
      <StaticRouter location={req.url} context={context}>
        <SecondApp />
      </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx);
    res.send(root);
  };

  app.use(serverRender);

  app.listen(5000, () => {
    console.log("Running on http://localhost:5000");
  });
  ```

  - 이 과정에서 리액트 라우터 안에 들어있는 StaticRouter 라는 컴포넌트가 사용되었다. 이는 react-router-dom 라이브러리에서 주로 서버 사이드 렌더링 용도로 사용되는 라우터이다.
  - props로 넣어 주는 location 따라 라우팅을 해주는데, 지금은 req.url이라는 값을 넣어 주었다.
  - 추가적으로 context 라는 props도 넣어 주었는데, 이 값을 사용하여 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정해줄 수 있다.

- 빌드

  ![18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled.png](18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled.png)

  - 우리가 사용한 라이브러리, 제작한 컴포넌트들이 묶이는 것을 볼 수 있다.

- 우리가 현재 브라우저에 보이는 데이터가 서버에서 렌더링된 것인지, 클라이언트에서 렌더링된 것인지 분간하기 어려울 것이다. 서버 사이드 렌더링이 정말 제대로 이루어졌는지 확인하려면 개발자 도구의 Network 탭을 확인하면 된다.

  ![18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%201.png](18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%201.png)

  Client Side Rendering

  ![18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%202.png](18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%202.png)

  Server Side Rendering

  - Response 탭에 들어가면 컴포넌트 렌더링 결과가 문자열로 전달되고 있는 것을 확인할 수 있다.

## 5. 정적 파일 제공하기

- Express에 내장되어 있는 static 미들웨어를 사용하여 서버를 통해 build에 있는 js,CSS 정적 파일들에 접근할 수 있도록 해주자.

  ```tsx
  // index.server.tsx

  // (...)
  const serverRender = (req: any, res: any, next: any) => {
    const context = {};
    const jsx: ReactElement = (
      <StaticRouter location={req.url} context={context}>
        <SecondApp />
      </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx);
    res.send(root);
  };

  const serve = express.static(path.resolve("./build"), {
    index: false, // ('/' 경로에서 index.html을 보여주지 않도록 설정)
  });

  app.use(serve); // 순서 중요!
  app.use(serverRender);

  // (...)
  ```

- yarn build 후 build/asset-mainfest.json을 확인하자

  ```json
  {
    "files": {
      "main.css": "/static/css/main.7fc7843a.chunk.css",
      "main.js": "/static/js/main.fde3b306.chunk.js",
      "runtime-main.js": "/static/js/runtime-main.7b8c1060.js",
      "static/js/2.3b7b31df.chunk.js": "/static/js/2.3b7b31df.chunk.js"
    }
  }
  ```

  - 라이브러리들의 정보를 담고 있는 2로 시작하는 자바스크립트 파일, 우리가 제작한 컴포넌트의 정보를 담고 있는 main, 그리고 runtime-main.js를 사용자에게 보내주는 파일 내부에 위치 시켜주어야 한다.

- index.server.tsx

  ```tsx
  const manifest = JSON.parse(
    fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf8")
  );

  const chunks = Object.keys(manifest)
    .filter((key) => /chunk\.js$/.exec(key)) // Chunk로 끝나는 키를 찾아서
    .map((key) => `<script src=${manifest.files[key]}></script>`) // 스크립트 태그로 변환한다.
    .join(" ");

  function createPage(root: string): string {
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <link href="${manifest.files["main.css"]}" rel="stylesheet"/>
          <title>React App</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root">
            ${root}
          </div>
          <script src="${manifest.files["runtime-main.js"]}"></script>
            ${chunks}
          <script src="${manifest.files["main.js"]}"></script>
        </body>
      </html>
      `;
  }

  const app = express();

  const serverRender = (req: any, res: any, next: any) => {
    const context = {};
    const jsx: ReactElement = (
      <StaticRouter location={req.url} context={context}>
        <SecondApp />
      </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx);
    res.send(createPage(root));
  };
  ```

# 3. 데이터 로딩

- 데이터 로딩은 서버 사이드 렌더링을 구현할 때 해결하기가 매우 까다로운 문제 중 하나이다. 이는 API 요청을 의미하는데, 일반적인 브라우저 환경에서는 API를 요청하고 응답을 받아 와서 리액트 state 혹은 리덕스 스토어에 넣으면 자동으로 리렌더링하니까 큰 걱정이 없지만, 서버의 경우 문자열 형태로 렌더링하는 것이므로 state나 리덕스 스토어 상태가 바뀐다고 해서 자동으로 리렌더링되지 않는다.
- 그 대신 우리가 renderToString 함수를 한 번 더 호출해 주어야 하고, 서버에서는 componentDiMount 같은 라이프사이클 API도 사용할 수 없다.

## 1. PreloadContext 만들기

- 현재 getUsers 함수는 UsersContainer의 useEffect 부분에서 호출된다. 이를 클래스형으로 작성했더라면 componentDidMount에서 호출했을 것이다.
- 서버 사이드 렌더링을 할 때는 useEffect나 componentDidMount에서 설정된 작업이 호출되지 않는다.
- 서버 환경에서 렌더링하기 전에 API를 요청하는 작업을 하려면 클래스형 컴포넌트가 지니고 있는 constructor 메서드를 사용하거나 render 함수 자체에서 처리해야 한다. 그리고 요청이 끝날 때까지 대기했다가 다시 렌더링해 주어야 한다.
- 이러한 작업을 PreloadContext를 만들고, 이를 사용하는 Preloader 컴포넌트를 만들어서 처리해보자.

```tsx
import { createContext, useContext } from "react";

type ContextType = {
  done: boolean;
  promises: Promise<any>[];
};

const PreloadContext = createContext<ContextType>({
  done: false,
  promises: [],
});

export default PreloadContext;

type Params = {
  resolve: any;
};
export const Preloader = ({ resolve }: Params) => {
  const preloadContext = useContext(PreloadContext);
  if (!preloadContext) return null; // context 값이 유효하지 않은 경우
  if (preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 안함

  // promises 배열에 프로미스 등록
  // 설령 resolve 함수가 프로미스를 반환하지 않더라도, 프로미스 취급을 하기 위해
  // Promise.resolve 함수 사용
  preloadContext.promises.push(Promise.resolve(resolve()));
  return null;
};
```

- done property는 promise 처리 여부를 나타낸다.
- 후에 서버 사이드 렌더링을 처리해 줄, index.server.tsx 에서 PreloadContext.Provider를 통해 어플리케이션 전역을 묶어줄 것 인데, 사용자가 로딩한 컴포넌트내에 Preloader를 통해 비동기 함수(ex.API Request)를 Context Store에 주입하여 Promise.all을 통해 해당 컴포넌트의 함수들을 실행시킬 것이다.

## 2. Container에 Preload 주입

```tsx
function UsersContainer({ getUsers, users }: Props) {
  useEffect(() => {
    if (users) return;
    getUsers();
  }, [getUsers, users]);

  return (
    <>
      <UsersComponent users={users} />
      <Preloader resolve={getUsers} />
    </>
  );
}
```

## 3. 서버에서 리덕스 설정 및 PreloadContext 사용하기

```tsx
const app = express();

const serverRender = async (req: any, res: any, next: any) => {
  const context = {};
  const store = createStore(RootReducer, applyMiddleware(ReduxThunk));

  const preloadContext = {
    done: false,
    promises: [],
  };

  const jsx: ReactElement = (
    <PreloadContext.Provider value={preloadContext}>
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <SecondApp />
        </StaticRouter>
      </Provider>
    </PreloadContext.Provider>
  );
  ReactDOMServer.renderToStaticMarkup(jsx);
  try {
    await Promise.all(preloadContext.promises);
  } catch (e) {
    return res.status(500);
  }
  preloadContext.done = true;
  const root = ReactDOMServer.renderToString(jsx);
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
  const stateScript = `<script>__PRELOAD_STATE = ${stateString}</script>`;

  res.send(createPage(root, stateScript));
};

const serve = express.static(path.resolve("./build"), {
  index: false, // ('/' 경로에서 index.html을 보여주지 않도록 설정)
});

app.use(serve); // 순서 중요!
app.use(serverRender);

app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});
```

- 브라우저에서 할때와 비슷하게 store를 만들어주면 된다.
  - 주의할 점은 서버가 실행될 때, 스토어를 한 번만 만드는 것이 아니라, 요청이 들어올 때마다 새로운 스토어를 만든다는 것이다.
- PreloadContext를 위한 context store 정보까지 만들어서 Provider로 어플리케이션을 감싸준다.
  - 즉, PreloadContext는 프로미스를 수집하기 위한 용도로 쓰이고, 렌더링을 하면서 Promise.all을 통해 사용자가 접속한 컴포넌트의 프로미스들을 실행시킨다.
- renderToStaticMarkup은 리액트를 사용하여 정적인 페이지를 만들 때 사용하는 함수이다. 이 함수로 만든 리액트 렌더링 결과물은 클라이언트 쪽에서 HTML DOM 인터랙션을 지원하게 된다.
  - 또한, renderToString 보다 속도면에서 빠르기 때문에 Preloader로 넣어 준 함수를 호출하는데 더 적합하다.

## 4. 스크립트로 스토어 초기 상태 주입하기

```tsx
function createPage(root: string, staticScript: string): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link href="${manifest.files["main.css"]}" rel="stylesheet"/>
        <title>React App</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">
          ${root}
        </div>
        **${staticScript}**
        <script src="${manifest.files["runtime-main.js"]}"></script>
          ${chunks}
        <script src="${manifest.files["main.js"]}"></script>
      </body>
    </html>
    `;
}
```

- 위의 코드는 API를 통해 받아 온 데이터는 렌더링하지만, 렌더링하는 과정에서 만들어진 스토어의 상태를 브라우저에서 재사용하지 못하는 상태이다. 서버에서 만들어 준 상태를 브라우저에서 재사용하려면, 현재 스토어 상태를 문자열로 변환한 뒤, 스크립트로 주입해주어야 한다.

```tsx
const store = createStore(
  RootReducer,
  (window as any).__PRELOADED_STATE__,
  applyMiddleware(ReduxThunk)
);
```

- 해당 **PRELOAD_STATE**는 전역 객체에 박히기 때문에 index.tsx에서 다음과 같이 사용해주면 된다.

![18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%203.png](18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%203.png)

## 5. redux-saga 서버 사이드 렌더링에 적용하기

- index.tsx

  ```tsx
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    RootReducer,
    (window as any).__PRELOADED_STATE__,
    applyMiddleware(ReduxThunk, sagaMiddleware)
  );
  sagaMiddleware.run(RootSaga);
  ```

- UserContainer.tsx

  ```tsx
  type Props = {
    id: string;
  };

  function UserContainer({ id }: Props) {
    const user = useSelector<RootStore>(
      ({ users }) => users.user
    ) as User | null;
    const dispatch = useDispatch();

    useEffect(() => {
      if (user && user.id === parseInt(id, 10)) return;
      dispatch(getUser(id));
    }, [dispatch, id, user]);

    if (!user) return <Preloader resolve={() => dispatch(getUser(id))} />;
    return <UserComponent user={user} />;
  }

  export default UserContainer;
  ```

  - 컨테이너에서 유효성 검사를 할 때 아직 정보가 없는 경우에는 user 값이 null을 가리키므로, User 컴포넌트가 렌더링되지 않도록, 컨테이너 컴포넌트에서 null을 반환해 주어야 한다.
  - 하지만 서버사이드렌더링을 해야 하기 때문에 null이 아닌, Preloader 컴포넌트를 렌더링하여 반환하도록 하겠다. 이렇게 해 주면 서버 사이드 렌더링을 하는 과정에서 데이터가 없을 경우, GET_USER 액션을 발생시킨다.

- UsersPage.tsx

  ```tsx
  function UsersPage() {
    return (
      <>
        <UsersContainer />
        <Route
          path="/users/:id"
          component={({ match }: RouteComponentProps<{ id: string }>) => (
            <UserContainer id={match.params.id!} />
          )}
        />
      </>
    );
  }
  ```

## 6. Redux-Saga를 위한 서버 사이드 렌더링 작업

- redux-thunk를 사용하면 Preloader를 통해, 호출한 함수들이 Promise를 반환하지만, redux-saga를 사용하면 Promise를 반환하지 않기 때문에 추가 작업이 필요하다.
- index.server.tsx

  ```tsx
  const serverRender = async (req: any, res: any, next: any) => {
    const context = {};
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
      RootReducer,
      applyMiddleware(ReduxThunk, sagaMiddleware)
    );
    const sagaPromise = sagaMiddleware.run(RootSaga).toPromise();

    const preloadContext = {
      done: false,
      promises: [],
    };

    const jsx: ReactElement = (
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <SecondApp />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    );
    ReactDOMServer.renderToStaticMarkup(jsx);
    // redux-saga의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료된다.
    store.dispatch<any>(END);
    try {
      await sagaPromise; // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다린다.
      await Promise.all(preloadContext.promises);
    } catch (e) {
      return res.status(500);
    }
    preloadContext.done = true;
    const root = ReactDOMServer.renderToString(jsx);
    // JSON을 문자열로 변환하고, 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
    const stateString = JSON.stringify(store.getState()).replace(
      /</g,
      "\\u003c"
    );
    const stateScript = `<script>__PRELOAD_STATE = ${stateString}</script>`; // 리덕스 초기 상태 주입

    res.send(createPage(root, stateScript));
  };
  ```

  - toPromise는 sagaMiddleware.run을 통해 만든 Task를 Promise로 변환한다. 별도의 작업을 하지 않으면 이 Promise는 끝나지 않는다.
  - 별도의 작업을 하지 않으면 이 Promise는 끝나지 않는다. 왜냐면, 우리가 만든 루트 사가에서 액션을 끝없이 모니터링 하기 때문이다.
  - redux-saga의 END 액션을 발생시키면 이 Promise를 끝낼 수 있다. END 액션이 발생되면 액션 모니터링 작업이 모두 종료되고, 모니터링되기 전에 시작된 getUserSaga와 같은 사가 함수들이 있다면 해당 함수들이 완료되고 나서 Promise가 끝나게 된다. 이 Promise가 끝나는 시점에 리덕스 스토어에는 우리가 원하는 데이터가 채워진다.
  - 그 이후에 다시 렌더링하면 우리가 원하는 결과물이 나타난다.

## 7. usePreloader Hook 만들기

- PreloadContext.tsx

  ```tsx
  export const usePreloader = (resolve: any) => {
    const preloadContext = useContext(PreloadContext);
    if (!preloadContext) return null; // context 값이 유효하지 않은 경우
    if (preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 안함

    preloadContext.promises.push(Promise.resolve(resolve()));
  };
  ```

- UserContainer.tsx

  ```tsx
  function UserContainer({ id }: Props) {
    const user = useSelector<RootStore>(
      ({ users }) => users.user
    ) as User | null;
    const dispatch = useDispatch();

    usePreloader(() => dispatch(getUser(id)));
    useEffect(() => {
      if (user && user.id === parseInt(id, 10)) return;
      dispatch(getUser(id));
    }, [dispatch, id, user]);

    if (!user) return null;
    return <UserComponent user={user} />;
  }
  ```

# 4. 서버 사이드 렌더링과 코드 스플리팅

- 서버 사이드 렌더링과 코드 스플리팅을 함께 사용할 때 쓰이는 Loadable Components는 서버 사이드 렌더링을 할 때, 필요한 서버 유틸 함수와 웹팩 플러그인, babel 플러그인을 제공해 준다.
- yarn add @loadable/component @loadable/server @loadable/webpack-plugin @loadable/babel-plugin
  - 이전에 설치할 때와 다르게 많은 라이브러리를 설치하는데, 이 패키지들은 서버 사이드 렌더링 시 중요한 역할을 하는 라이브러리들 이다.

## 1. 라우트 컴포넌트 스플리팅하기

```tsx
import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Menu from "./atoms/Menu";
import loadable from "@loadable/component";

const RedPage = loadable(() => import("./pages/RedPage"));
const BluePage = loadable(() => import("./pages/BluePage"));
const UsersPage = loadable(() => import("./pages/UsersPage"));

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
      <Route path="/users" component={UsersPage} />
    </div>
  );
}

export default App;
```

- 해당 예제를 slow 3G 환경으로 테스트 해보면 깜박임 현상이 발생하는 것을 확인할 수 있다.

## 2. 웹팩과 babel 플러그인 적용

- Loadable Components 에서 제공하는 웹팩과 babel 플러그인을 적용하면 깜박임 현상을 해결할 수 있다.
- package.json

  ```json
  {
    // (...)
    "babel": {
      "presets": ["react-app"],
      "plugins": ["@loadable/babel-plugin"]
    }
  }
  ```

- Webpack.config.js

  ```jsx
  const LoadablePlugin = require("@loadable/webpack-plugin");
  // (...)
  plugins[
  	new LoadablePlugin(),
  	// (...)
  ]
  // (...)
  ```

  - 다음과 같이 설정하고, yarn build를 실행하면 build 디렉터리에 loadable-stats.json 이라는 파일이 만들어져 있을 것이다.
  - 해당 파일은 각 컴포넌트의 코드가 어떤 청크(chunk)파일에 들어가 있는지에 대한 정보를 가지고 있다. 서버 사이드 렌더링을 할 때, 이 파일을 참고하여 어떤 컴포넌트가 렌더링되었는지에 따라 어떤 파일들을 사전에 불러와야 할지 설정할 수 있다.

## 3. 필요한 청크 파일 경로 추출하기

- 서버 사이드 렌더링 후 브라우저에서 어떤 파일을 사전에 불러와야 할지 알아내고, 해당 파일들의 경로를 추출하기 위해 Loadable Components 에서 제공하는 ChunkExtractor와 ChunkExtractorManager를 사용한다.
- 모든 청크 파일의 내용은 Loadable Components를 통해 파일 경로를 조회하므로, 기존에 asset-manifest.json 및 chunk 파일 따오는 로직은 지워도 된다.
- index.server.tsx

  ```tsx
  const statsFile = path.resolve("./build/loadable-stats.json");

  function createPage(root: string, tags: any): string {
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          ${tags.styles}
          ${tags.links}
          <title>React App</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root">
            ${root}
          </div>
          ${tags.scripts}
        </body>
      </html>
      `;
  }

  const app = express();

  const serverRender = async (req: any, res: any, next: any) => {
    const context = {};
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
      RootReducer,
      applyMiddleware(ReduxThunk, sagaMiddleware)
    );
    const sagaPromise = sagaMiddleware.run(RootSaga).toPromise();

    const preloadContext = {
      done: false,
      promises: [],
    };

    const extractor = new ChunkExtractor({ statsFile });

    const jsx: ReactElement = (
      <ChunkExtractorManager extractor={extractor}>
        <PreloadContext.Provider value={preloadContext}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <SecondApp />
            </StaticRouter>
          </Provider>
        </PreloadContext.Provider>
      </ChunkExtractorManager>
    );
    ReactDOMServer.renderToStaticMarkup(jsx);
    // redux-saga의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료된다.
    store.dispatch<any>(END);
    try {
      await sagaPromise; // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다린다.
      await Promise.all(preloadContext.promises);
    } catch (e) {
      return res.status(500);
    }
    preloadContext.done = true;
    const root = ReactDOMServer.renderToString(jsx);
    // JSON을 문자열로 변환하고, 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
    const stateString = JSON.stringify(store.getState()).replace(
      /</g,
      "\\u003c"
    );
    const stateScript = `<script>__PRELOAD_STATE = ${stateString}</script>`; // 리덕스 초기 상태 주입

    const tags = {
      scripts: stateScript + extractor.getScriptTags(),
      links: extractor.getLinkTags(),
      styles: extractor.getStyleTags(),
    };

    res.send(createPage(root, tags));
  };

  const serve = express.static(path.resolve("./build"), {
    index: false, // ('/' 경로에서 index.html을 보여주지 않도록 설정)
  });

  app.use(serve); // 순서 중요!
  app.use(serverRender);

  app.listen(5000, () => {
    console.log("Running on http://localhost:5000");
  });
  ```

## 4. loadableReady와 hydrate

- Loadable Components를 사용하면, 성능을 최적화하기 위해 모든 자바스크립트 파일을 동시에 받아온다.
- 모든 스크립트가 로딩되고 나서, 렌더링하도록 처리하기 위해서는 loadableReady라는 함수를 사용해 주어야 한다.
- 추가로 리액트에는 hydrate라는 함수가 있는데, 이 함수는 기존에 서버 사이드 렌더링된 결과물이 이미 있을 경우, 새로 렌더링하지 않고, 기존에 존재하는 UI에 이벤트만 연동하여 어플리케이션을 초기 구동할 때 필요한 리소스를 최소화함으로써, 성능을 최적화해 준다.
- index.tsx 수정

  ```tsx
  const Root = () => (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  const root = document.getElementById("root");

  if (process.env.NODE_ENV === "production") {
    loadableReady(() => {
      ReactDOM.hydrate(<Root />, root);
    });
  } else {
    ReactDOM.render(<Root />, root);
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  ```

![18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%204.png](18_%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%89%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3%20%E1%84%85%E1%85%A6%E1%86%AB%E1%84%83%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20c3df92abd7204452ba678eada8c1a9a3/Untitled%204.png)

# 5. 서버 사이드 렌더링의 환경 구축을 위한 대안

- 서버 사이드 렌더링 자체만 놓고 보면 꽤나 간단한 작업이지만 데이터 로딩, 코드 스플리팅까지 하면 참 번거로운 작업이다. 만약 이러한 설정을 하나하나 직접하는 것이 귀찮다고 느껴진다면 다른 대안도 있다.

## 1. Next.js

[Next.js by Vercel - The React Framework](https://nextjs.org/)

- 해당 라이브러리를 사용하면, 이 작업을 최소한의 설정으로 간단하게 처리할 수 있다. 그 대신 몇 가지 제한이 존재하는데, 가장 대표적인 것으로는 리액트 라우터와 호환되지 않는 점을 꼽을 수 있다.
- 리액트 라우터는 컴포넌트 기반으로 라우트를 설정하는 반면에 Next.js는 파일 시스템에 기반하여 라우트를 설정한다. 컴포넌트 파일의 경로와 파일 이름을 설정하여 라우트를 설정한다는 의미이다. 그 외에도 복잡한 작업들을 모두 Next.js가 대신해 주기 때문에 실제 작동 원리를 파악하기 힘들어질 수도 있다.
- 코드 스플리팅, 데이터 로딩, 서버 사이드 렌더링을 가장 쉽게 적용하고 싶다면 Next.js를 사용하는 것을 추천한다. 하지만 Next.js의 라우팅 방식보다 리액트 라우터의 라우팅 방식을 더 좋아하거나 기존의 프로젝트에 적용해야 하거나, 혹은 작동 원리를 제대로 파악하면서 구현하고 싶다면 직접 구현하는 것이 좋다.

## 2. Razzle

[jaredpalmer/razzle](https://github.com/jaredpalmer/razzle)

- Next.js 처럼 서버 사이드 렌더링을 쉽게 할 수 있도록 해 주는 도구이며, 프로젝트 구성이 CRA와 매우 유사하다는 장점이 있다. 리액트 라우터와도 호환된다.
- 하지만 최신 버전의 Loadable Components가 기본 설정으로는 작동하지 않아서 적용하기가 까다롭다.

# 6. 정리

- 서버 사이드 렌더링은 어플리케이션에 사용자가 많아졌을 때, 검색 엔진 최적화 및 사용자 경험 개선을 원한다면 도입할 가치가 있는 기술이다.
- 단, 이를 도입하면 프로젝트가 조금 복잡해질 수는 있다.
