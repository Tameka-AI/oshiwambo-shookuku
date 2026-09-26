import type { Book } from "@shookuku/content";

/** The real cover photograph when we have one, otherwise a typeset clay card. */
export function BookCover({ book, author, eager }: { book: Book; author: string; eager?: boolean }) {
  if (book.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="cover-img"
        src={book.cover}
        width={625}
        height={900}
        alt={`Front cover of ${book.title}`}
        loading={eager ? "eager" : "lazy"}
      />
    );
  }
  return (
    <div className="cover" aria-hidden="true">
      <small>{book.publisher}, {book.year}</small>
      <div>
        <b>{book.title}</b>
        {book.subtitle ? (
          <>
            <br />
            <i>{book.subtitle}</i>
          </>
        ) : null}
      </div>
      <small>{author}</small>
    </div>
  );
}
