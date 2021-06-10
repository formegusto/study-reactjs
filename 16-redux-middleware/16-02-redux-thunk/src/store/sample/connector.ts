import { connect } from "react-redux";
import { RootStore } from "..";
import { getPost, getUsers } from "./actions";

const mapState = ({ Sample, Loading: loading }: RootStore) => ({
  ...Sample,
  loading,
});

const SampleConnector = connect(mapState, { getPost, getUsers });
export default SampleConnector;
