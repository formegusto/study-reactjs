import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

function Nesting() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path="/">
          Home Page
        </Route>
        <Route path="/topics">
          <Topics />
        </Route>
      </Switch>
    </Router>
  );
}

function Topics() {
  const { path, url } = useRouteMatch();
  console.log("path:", path, "url:", url);
  return (
    <div>
      <h2>Topcis</h2>
      <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering With React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v.state</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic />
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  const { path, url } = useRouteMatch();
  console.log("path:", path, "url:", url);
  const { topicId } = useParams<{ topicId: string }>();
  return <h4>{topicId}</h4>;
}

export default Nesting;
