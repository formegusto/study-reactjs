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
  // redux-saga??? END ????????? ??????????????? ????????? ?????????????????? ???????????? ?????? ????????????.
  store.dispatch<any>(END);
  try {
    await sagaPromise; // ????????? ?????? ????????? ???????????? ?????? ?????? ????????? ????????????.
    await Promise.all(preloadContext.promises);
  } catch (e) {
    return res.status(500);
  }
  preloadContext.done = true;
  const root = ReactDOMServer.renderToString(jsx);
  // JSON??? ???????????? ????????????, ?????? ??????????????? ???????????? ?????? ???????????? ?????? <??? ?????? ??????
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
  const stateScript = `<script>__PRELOAD_STATE = ${stateString}</script>`; // ????????? ?????? ?????? ??????

  const tags = {
    scripts: stateScript + extractor.getScriptTags(),
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  };

  res.send(createPage(root, tags));
};

const serve = express.static(path.resolve("./build"), {
  index: false, // ('/' ???????????? index.html??? ???????????? ????????? ??????)
});

app.use(serve); // ?????? ??????!
app.use(serverRender);

app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});
