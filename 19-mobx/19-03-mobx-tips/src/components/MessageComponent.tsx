import { Author } from "../store/message";

type Props = {
  title: string;
  authorName: string;
  changeAuthor: (name: string) => void;
  changeAuthorName: (name: string) => void;
};

function MessageComponent({
  title,
  authorName,
  changeAuthor,
  changeAuthorName,
}: Props) {
  return (
    <>
      <h1>{title}</h1>
      <h2>Author: {authorName}</h2>
      <input
        type="text"
        value={authorName}
        onChange={(e) => changeAuthor(e.target.value)}
        placeholder="Change Author"
      />
      <input
        type="text"
        value={authorName}
        onChange={(e) => changeAuthorName(e.target.value)}
        placeholder="Change Author Name"
      />
    </>
  );
}

export default MessageComponent;
