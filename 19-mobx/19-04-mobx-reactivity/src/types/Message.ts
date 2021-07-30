import { makeAutoObservable } from "mobx";

type Author = {
  name: string;
  [key: string]: any;
};

class Message {
  title: string;
  author: Author;
  likes: string[];

  constructor(title: string, author: Author, likes: string[]) {
    makeAutoObservable(this);
    this.title = title;
    this.author = author;
    this.likes = likes;
  }

  updateTitle(title: string) {
    this.title = title;
  }
}

export default Message;
