import { inject, observer } from "mobx-react";
import { useCallback, useEffect } from "react";
import UsersSecComponent from "../components/UsersSecComponent";
import RootStore from "../store";
import UserStore from "../store/users";

type Props = {
  store?: UserStore;
};

function UsersSecContainer({ store }: Props) {
  useEffect(() => {
    store!.fetchUsers();
  }, [store]);

  const selectUser = useCallback(
    (id: number) => {
      store!.fetchUser(id);
    },
    [store]
  );

  return (
    <UsersSecComponent
      user={store!.user}
      users={store!.users}
      selectUser={selectUser}
    />
  );
}

export default inject(({ UserStore }: RootStore) => ({
  store: UserStore,
}))(observer(UsersSecContainer));
