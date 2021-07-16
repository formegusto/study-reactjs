import { User } from "../../store/users/types";
import client from "../client";

const fetchUsers = () => client.get<User[]>(`/users`);
const fetchUser = (id: number) => client.get<User>(`/users/${id}`);

export { fetchUsers, fetchUser };
