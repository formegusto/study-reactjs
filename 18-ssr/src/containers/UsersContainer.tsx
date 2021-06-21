import React, { useEffect } from "react";
import { ConnectedProps } from "react-redux";
import UsersComponent from "../components/UsersComponent";
import Connector from "../store/users/connetor";
import { Preloader } from "../lib/PreloadContext";

type Props = ConnectedProps<typeof Connector>;

function UsersContainer({ getUsers, users }: Props) {
  useEffect(() => {
    if (users) return;
    getUsers();
  }, [getUsers, users]);

  return (
    <>
      <UsersComponent users={users} />
      {/* <Preloader resolve={getUsers} /> */}
    </>
  );
}

export default Connector(UsersContainer);
