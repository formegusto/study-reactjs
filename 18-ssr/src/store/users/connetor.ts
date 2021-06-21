import { connect } from "react-redux";
import { RootStore } from "..";
import * as actions from "./actions";

const mapState = ({ users }: RootStore) => ({ ...users });

const UserConnector = connect(mapState, { ...actions });
export default UserConnector;
