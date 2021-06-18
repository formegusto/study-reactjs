import React from "react";
import { Link } from "react-router-dom";

type Props = {
  users: any;
};

function UsersComponent(props: Props) {
  return (
    <div>
      <ul>
        {props.users &&
          props.users.map((user: any) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>{user.username}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default UsersComponent;
