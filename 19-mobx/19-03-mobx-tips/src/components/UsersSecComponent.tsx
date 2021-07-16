import styled from "styled-components";
import { User } from "../store/users/types";

type Props = {
  user: User | null;
  users: User[];
  selectUser: (id: number) => void;
};

function UsersSecComponent({ user, users, selectUser }: Props) {
  return (
    <div className="users">
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => selectUser(user.id)}>
            {user.name}
          </li>
        ))}
      </ul>
      <UserInfo className={user ? "on" : "off"}>{user?.username}</UserInfo>
    </div>
  );
}

const UserInfo = styled.div`
  position: absolute;

  left: calc(50% - 15%);
  bottom: 0;
  width: 30%;
  height: 50%;

  transform: translateY(100%);
  border-radius: 1rem 1rem 0 0;
  transition: 0.7s;

  box-shadow: 2px 2px 4px black;

  &.on {
    transform: translateY(0);
  }
`;

export default UsersSecComponent;
