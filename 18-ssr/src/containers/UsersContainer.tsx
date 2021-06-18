import React, { useEffect } from "react";
import { ConnectedProps } from "react-redux";
import UsersComponent from "../components/UsersComponent";
import Connector from "../store/users/connetor";

type Props = ConnectedProps<typeof Connector>;

function UsersContainer({ getUsers, users }: Props) {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return <UsersComponent users={users} />;
}

export default Connector(UsersContainer);
