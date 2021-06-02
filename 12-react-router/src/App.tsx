import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPage";

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
        <li>
          <Link to="/profiles">Profiles</Link>
        </li>
      </ul>
      <hr />
      <div>
        <Route path="/" component={HomePage} exact={true} />
        <Route path={["/about", "/info"]} component={AboutPage} />
        <Route path="/profiles" component={ProfilesPage} />
      </div>
    </div>
  );
}

export default App;
