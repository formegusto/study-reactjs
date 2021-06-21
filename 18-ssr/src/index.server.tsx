import React, { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom";
import SecondApp from "./SecondApp";
import path from "path";
import fs from "fs";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import RootReducer from "./store";
import ReduxThunk from "redux-thunk";
import PreloadContext from "./lib/PreloadContext";
import createSagaMiddleware, { END } from "redux-saga";
import RootSaga from "./store/saga";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";

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
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
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
