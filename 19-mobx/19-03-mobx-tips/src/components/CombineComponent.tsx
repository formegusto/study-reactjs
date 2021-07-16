import styled from "styled-components";
import { Todo } from "../store/todos/types";
import { User } from "../store/users/types";

type Props = {
  users: User[];
  todos: Todo[];
};

function CombineComponent({ users, todos }: Props) {
  return (
    <Wrap>
      <FlexBlock>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </FlexBlock>
      <FlexBlock>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </FlexBlock>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;

  width: 100vw;
  height: 100vh;

  & > div:not(:last-child) {
    border-right: 1px solid black;
  }
`;

const FlexBlock = styled.div`
  flex: 1;
  height: 100%;

  overflow-y: scroll;

  box-sizing: border-box;
`;

export default CombineComponent;
