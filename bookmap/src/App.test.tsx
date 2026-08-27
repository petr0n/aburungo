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
import { displayBooks } from "./shell";

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
    expect(within(bookNav).getAllByRole("button")).toHaveLength(displayBooks.length);
    const rail = screen.getByRole("navigation", { name: "Chapters" });
    expect(within(rail).getAllByRole("button")).toHaveLength(books[0].chapters.length);
  });

  it("switches to the Book Two shell and back", () => {
    // The shell is bookmap-only scaffolding (see shell.ts); this pins that it
    // is reachable from the nav and honest about being empty.
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Book Two" }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Book Two Ladder");
    expect(screen.getByText("Nothing on the ladder yet")).toBeTruthy();
    // No chapters means no rail and no chapter sections.
    expect(screen.queryByRole("navigation", { name: "Chapters" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Book One" }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${books[0].title} Ladder`);
  });
});
