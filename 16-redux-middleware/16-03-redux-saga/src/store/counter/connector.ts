import { connect } from "react-redux";
import { RootStore } from "../";
import * as counterActions from "./actions";

const mapState = ({ counter }: RootStore) => ({
  counter,
});
const CounterConnector = connect(mapState, counterActions);
export default CounterConnector;
