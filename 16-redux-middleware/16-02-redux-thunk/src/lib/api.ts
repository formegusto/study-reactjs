import axios from "axios";
import { Post, Users } from "../store/sample/types";

export const getPost = (id: number) =>
  axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`);
export const getUsers = () =>
  axios.get<Users[]>("https://jsonplaceholder.typicode.com/users");
