// @vitest-environment jsdom
/**
 * The book map SPA renders the app's own content modules, so this is less a
 * component test than the sync rule itself: if a chapter, book or lesson
 * exists in src/content/, it must be on the page.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";
import { books } from "@/content/books";

describe("book map SPA", () => {
  afterEach(cleanup);

  it("opens on the first book with every chapter and lesson on the page", () => {
    // Single-pass DOM reads compared as whole arrays: per-lesson getAllByText
    // walks the full 100-lesson tree each time and blew CI's 5s test timeout.
    const { container } = render(<App />);
    const bookOne = books[0];
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${bookOne.title} Ladder`);

    const chapterHeadings = [...container.querySelectorAll("section.chapter h2")].map((el) => el.textContent);
    expect(chapterHeadings).toEqual(bookOne.chapters.map((c) => c.title));

    // Every shipped teaching lesson, in ladder order; checkpoints render as
    // .cp-title rows, so .title is exactly the teaching set.
    const lessonTitles = [...container.querySelectorAll(".row .title")].map((el) => el.textContent);
    expect(lessonTitles).toEqual(bookOne.lessons.filter((l) => !l.checkpoint).map((l) => l.title));
  });

  it("offers one book chip per book and one rail jump per chapter", () => {
    render(<App />);
    const bookNav = screen.getByRole("navigation", { name: "Books" });
    expect(within(bookNav).getAllByRole("button")).toHaveLength(books.length);
    const rail = screen.getByRole("navigation", { name: "Chapters" });
    expect(within(rail).getAllByRole("button")).toHaveLength(books[0].chapters.length);
  });

  it("switches to Book Two and back, rendering each book's own ladder", () => {
    // Book Two replaced a hand-written shell here. Switching is what proves the
    // page renders whichever book the nav selects rather than Book One's
    // content under another title.
    const { container } = render(<App />);
    const bookTwo = books[1];

    fireEvent.click(screen.getByRole("button", { name: bookTwo.title }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${bookTwo.title} Ladder`);
    const chapterHeadings = [...container.querySelectorAll("section.chapter h2")].map((el) => el.textContent);
    expect(chapterHeadings).toEqual(bookTwo.chapters.map((c) => c.title));

    fireEvent.click(screen.getByRole("button", { name: books[0].title }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${books[0].title} Ladder`);
  });

  it("labels a book by the prefix its ids carry, not by its progress key", () => {
    // These are the same string for Book One and differ for Book Two
    // ("b2" against "book-2"), so this only became checkable now.
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: books[1].title }));
    expect(screen.getByText(/id prefix b2$/)).toBeTruthy();
  });
});
