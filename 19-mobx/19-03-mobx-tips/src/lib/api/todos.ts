import { Todo } from "../../store/todos/types";
import client from "../client";

const fetchTodos = () => client.get<Todo[]>("/todos");

export { fetchTodos };
