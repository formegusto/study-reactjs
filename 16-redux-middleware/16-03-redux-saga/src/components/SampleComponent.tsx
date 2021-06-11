import React from "react";
import { Post, User } from "../store/sample/types";

type Props = {
  loadingUsers: boolean;
  loadingPost: boolean;
  users?: User[] | null;
  post?: Post | null;
};

function SampleComponent({ loadingUsers, loadingPost, users, post }: Props) {
  return (
    <div>
      {loadingPost ? (
        <section>로딩중..</section>
      ) : (
        <section>
          <h1>포스트</h1>
          <div>
            <h3>{post?.title}</h3>
            <h3>{post?.body}</h3>
          </div>
        </section>
      )}
      <hr />
      {loadingUsers ? (
        <section>로딩중...</section>
      ) : (
        <section>
          <h1>사용자 목록</h1>
          <ul>
            {users?.map((user) => (
              <li key={user.id}>{`${user.name} (${user.email})`}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default SampleComponent;
