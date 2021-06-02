import React from "react";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HistoryPage from "./pages/HistoryPage";
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
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/profiles">Profiles</Link>
        </li>
      </ul>
      <hr />
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
    </div>
  );
}

export default App;
