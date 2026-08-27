import type { Book } from "@/types";

type Props = {
  books: readonly Book[];
  current: Book;
  onSelect: (book: Book) => void;
};

/** The book switcher at the top of the page — one chip per book, the open one filled. */
export function BookNav({ books, current, onSelect }: Props) {
  return (
    <nav className="bks" aria-label="Books">
      {books.map((book) => (
        <button
          key={book.id}
          type="button"
          className={book.id === current.id ? "bk bk--on" : "bk"}
          aria-current={book.id === current.id ? "page" : undefined}
          onClick={() => onSelect(book)}
        >
          {book.title}
        </button>
      ))}
    </nav>
  );
}
