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

const manifest = JSON.parse(
  fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf8")
);

const chunks = Object.keys(manifest)
  .filter((key) => /chunk\.js$/.exec(key)) // Chunk로 끝나는 키를 찾아서
  .map((key) => `<script src=${manifest.files[key]}></script>`) // 스크립트 태그로 변환한다.
  .join(" ");

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
        ${staticScript}
        <script src="${manifest.files["runtime-main.js"]}"></script>
          ${chunks}
        <script src="${manifest.files["main.js"]}"></script>
      </body>
    </html>
    `;
}

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
