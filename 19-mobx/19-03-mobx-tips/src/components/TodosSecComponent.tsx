import { Todo } from "../store/todos/types";

type Props = {
  todos: Todo[];
};

function TodosSecComponent({ todos }: Props) {
  return (
    <div>
      <ul>
        {todos.map((todo, idx) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodosSecComponent;
