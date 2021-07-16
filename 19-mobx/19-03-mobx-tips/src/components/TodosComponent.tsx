import { Todo } from "../store/todos/types";

type Props = {
  todos: Todo[];
  lookUser: (idx: number) => void;
};

function TodosComponent({ todos, lookUser }: Props) {
  return (
    <div className="todos">
      {todos.map((todo, idx) => (
        <div key={idx} onClick={() => lookUser(idx)}>
          {todo.title}
        </div>
      ))}
    </div>
  );
}

export default TodosComponent;
