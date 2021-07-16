import { observer } from "mobx-react";
import { useEffect } from "react";
import CombineComponent from "../components/CombineComponent";
import RootStore from "../store";

type Props = {
  store: RootStore;
};

function CombineContainer({
  store: { UserStore: user, TodosStore: todos },
}: Props) {
  useEffect(() => {
    user.fetchUsers();
    todos.fetchTodos();
  }, [user, todos]);

  return <CombineComponent users={user.users} todos={todos.todos} />;
}

export default observer(CombineContainer);
