import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useParams,
} from "react-router-dom";

function Child() {
  const { id } = useParams<{ id: string }>();

  return <h1>{id}</h1>;
}

function Params() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/노태헌">노태헌</Link>
        </li>
        <li>
          <Link to="/김태헌">김태헌</Link>
        </li>
        <li>
          <Link to="/이태헌">이태헌</Link>
        </li>
        <li>
          <Link to="/박태헌">박태헌</Link>
        </li>
      </ul>

      <Switch>
        <Route path="/:id" component={Child} />
      </Switch>
    </Router>
  );
}

export default Params;
