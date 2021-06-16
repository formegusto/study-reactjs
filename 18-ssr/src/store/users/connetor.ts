import { connect } from "react-redux";
import { RootStore } from "..";
import { getUsers } from "./actions";

const mapState = ({ users }: RootStore) => ({ ...users });

const UserConnector = connect(mapState, { getUsers });
export default UserConnector;
