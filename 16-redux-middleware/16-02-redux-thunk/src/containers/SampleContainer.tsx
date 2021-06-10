import React, { useEffect } from "react";
import { ConnectedProps } from "react-redux";
import SampleComponent from "../components/SampleComponent";
import SampleConnector from "../store/sample/connector";

type Props = ConnectedProps<typeof SampleConnector>;

function SampleContainer({ getPost, getUsers, loading, post, users }: Props) {
  useEffect(() => {
    getPost(1);
    getUsers();
  }, [getPost, getUsers]);

  return <SampleComponent loading={loading} post={post} users={users} />;
}

export default SampleConnector(SampleContainer);
