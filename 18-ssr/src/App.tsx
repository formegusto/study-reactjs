import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Menu from "./atoms/Menu";
import RedPage from "./pages/RedPage";
import BluePage from "./pages/BluePage";

function App() {
  return (
    <>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
    </>
  );
}

export default App;
