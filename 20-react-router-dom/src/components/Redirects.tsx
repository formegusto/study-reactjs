import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthExample() {
  return (
    <AuthProvider>
      <Router>
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route path="/public">Public Page</Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute path="/protected">Protected Page</PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

function AuthButton() {
  const history = useHistory();
  const auth = useAuth();

  return auth!.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth!.signout(() => history.push("/"));
        }}
      >
        SignOut
      </button>
    </p>
  ) : (
    <p>로그인하셔야함</p>
  );
}

function PrivateRoute({ children, ...rest }: React.PropsWithChildren<any>) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth!.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function LoginPage() {
  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();
  const auth = useAuth();

  const { from } = location.state || { from: { pathname: "/" } };
  const login = () => {
    auth!.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

export default AuthExample;
