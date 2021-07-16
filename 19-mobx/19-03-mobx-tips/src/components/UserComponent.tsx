import { User } from "../store/users/types";

type Props = {
  user: User | null;
};

function UserComponent({ user }: Props) {
  return <div className="user">{user && user.username}</div>;
}

export default UserComponent;
