import React, { useEffect } from "react";
import { ConnectedProps } from "react-redux";
import SampleComponent from "../components/SampleComponent";
import SampleConnector from "../store/sample/connector";
import { GET_POST, GET_USERS } from "../store/sample/types";

type Props = ConnectedProps<typeof SampleConnector>;

function SampleContainer({ getPost, getUsers, loading, post, users }: Props) {
  useEffect(() => {
    getPost(1);
    getUsers();
  }, [getPost, getUsers]);

  return (
    <SampleComponent
      loadingPost={loading[GET_POST]}
      loadingUsers={loading[GET_USERS]}
      post={post}
      users={users}
    />
  );
}

export default SampleConnector(SampleContainer);
