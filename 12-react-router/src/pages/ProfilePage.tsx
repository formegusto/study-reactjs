import React from "react";
import { RouteComponentProps } from "react-router";

type User = {
  name: string;
  description: string;
};

type UserList = {
  [key: string]: User;
};

type Parameter = {
  username: string;
};

const data: UserList = {
  iamformegusto: {
    name: "노태헌",
    description: "Hello! iamformegusto!",
  },
  mike: {
    name: "킹만규",
    description: "Go DDosunamu",
  },
};

function ProfilePage({ match }: RouteComponentProps<Parameter>) {
  const { username } = match.params;
  const profile = data[username];

  return profile ? (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
    </div>
  ) : (
    <div>존재하지 않는 사용자입니다.</div>
  );
}

export default ProfilePage;
