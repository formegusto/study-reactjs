import React, { useEffect } from "react";
import { ConnectedProps } from "react-redux";
import SampleComponent from "../components/SampleComponent";
import SampleConnector from "../store/sample/connector";

type Props = ConnectedProps<typeof SampleConnector>;

function SampleContainer({ getPost }: Props) {
  useEffect(() => {
    getPost(1);
  }, [getPost]);

  return <SampleComponent />;
}

export default SampleConnector(SampleContainer);
