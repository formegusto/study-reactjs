import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../store";
import { getUser } from "../store/users/actions";
import { User } from "../store/users/types";
import UserComponent from "../components/UserComponent";
import { usePreloader } from "../lib/PreloadContext";

type Props = {
  id: string;
};

function UserContainer({ id }: Props) {
  const user = useSelector<RootStore>(({ users }) => users.user) as User | null;
  const dispatch = useDispatch();

  // usePreloader(() => dispatch(getUser(id)));
  useEffect(() => {
    if (user && user.id === parseInt(id, 10)) return;
    dispatch(getUser(id));
  }, [dispatch, id, user]);

  if (!user) return null;
  return <UserComponent user={user} />;
}

export default UserContainer;
