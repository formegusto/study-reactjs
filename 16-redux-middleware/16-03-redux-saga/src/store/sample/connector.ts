import { connect } from "react-redux";
import { RootStore } from "..";
import * as SampleActions from "./actions";

const mapState = ({ sample, loading }: RootStore) => ({
  ...sample,
  loading,
});

const SampleConnector = connect(mapState, SampleActions);
export default SampleConnector;
