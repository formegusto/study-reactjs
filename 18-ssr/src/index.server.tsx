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
