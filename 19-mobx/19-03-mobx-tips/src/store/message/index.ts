import { action, makeAutoObservable } from "mobx";

export type Author = {
  name: string;
};

class Message {
  title: string;
  author: Author;
  likes: string[];
  constructor(title: string, author: Author, likes: string[]) {
    makeAutoObservable(this, {
      changeAuthor: action.bound,
      changeAuthorName: action.bound,
    });
    this.title = title;
    this.author = author;
    this.likes = likes;
  }

  updateTitle(title: string) {
    this.title = title;
  }

  changeAuthor(name: string) {
    this.author = {
      name: name,
    };
  }

  changeAuthorName(name: string) {
    this.author.name = name;
  }
}

export default Message;
