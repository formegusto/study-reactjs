import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

function Basic() {
  return (
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
  );
}

export default Basic;
