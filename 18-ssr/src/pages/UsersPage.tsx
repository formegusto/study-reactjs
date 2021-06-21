import React from "react";
import UsersContainer from "../containers/UsersContainer";
import { Route, RouteComponentProps } from "react-router-dom";
import UserContainer from "../containers/UserContainer";

function UsersPage() {
  return (
    <>
      <UsersContainer />
      <Route
        path="/users/:id"
        component={({ match }: RouteComponentProps<{ id: string }>) => (
          <UserContainer id={match.params.id!} />
        )}
      />
    </>
  );
}

export default UsersPage;
