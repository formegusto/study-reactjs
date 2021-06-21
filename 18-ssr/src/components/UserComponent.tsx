import React from "react";
import { User } from "../store/users/types";

type Props = {
  user: User | null;
};

function UserComponent(props: Props) {
  return (
    <div>
      <h1>
        {props.user?.username} ({props.user?.name})
      </h1>
      <p>
        <b>e-mail:</b> {props.user?.email}
      </p>
    </div>
  );
}

export default UserComponent;
