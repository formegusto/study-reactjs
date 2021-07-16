import { User } from "../users/types";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  user: User;
}
