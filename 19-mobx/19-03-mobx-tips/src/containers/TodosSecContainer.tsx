import { inject, observer } from "mobx-react";
import { useEffect } from "react";
import TodosSecComponent from "../components/TodosSecComponent";
import RootStore from "../store";
import TodosStore from "../store/todos";
// import { Todo } from "../store/todos/types";

type Props = {
  store?: TodosStore;
};

function TodosSecContainer({ store }: Props) {
  useEffect(() => {
    store!.fetchTodos();
  }, [store]);

  return <TodosSecComponent todos={store!.todos} />;
}

export default inject(({ TodosStore }: RootStore) => ({
  store: TodosStore,
}))(observer(TodosSecContainer));
