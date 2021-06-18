import React from "react";
import { Link } from "react-router-dom";
import { User } from "../store/users/types";

type Props = {
  users: User[] | null;
};

function UsersComponent(props: Props) {
  return (
    <div>
      <ul>
        {props.users?.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersComponent;
