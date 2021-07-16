import { observer } from "mobx-react";
import { useEffect } from "react";
import styled from "styled-components";
// import TodosComponent from "../components/TodosComponent";
// import UserComponent from "../components/UserComponent";
import TodosStore from "../store/todos";

type Props = {
  todos: TodosStore;
};

function TodosContainer({ todos }: Props) {
  useEffect(() => {
    todos.fetchTodos();
  }, [todos]);

  // const lookUser = useCallback(
  //   (idx: number) => {
  //     todos.fetchUser(idx);
  //   },
  //   [todos]
  // );

  return (
    <Wrap>
      {/* <UserComponent user={todos.userStore.user} /> */}
      {/* <TodosComponent todos={todos.todos} lookUser={lookUser} /> */}
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100vw;
  display: flex;

  & > div {
    flex: 1;
  }

  & > .user {
    position: fixed;

    right: 50%;
    top: 0;
  }
`;

export default observer(TodosContainer);
