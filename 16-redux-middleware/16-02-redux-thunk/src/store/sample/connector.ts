import { connect } from "react-redux";
import { RootStore } from "..";
import { getPost, getUsers } from "./actions";

const mapState = ({ Sample }: RootStore) => ({
  ...Sample,
});

const SampleConnector = connect(mapState, { getPost, getUsers });
export default SampleConnector;
