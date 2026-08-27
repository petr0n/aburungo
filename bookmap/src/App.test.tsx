// @vitest-environment jsdom
/**
 * The book map SPA renders the app's own content modules, so this is less a
 * component test than the sync rule itself: if a chapter, book or lesson
 * exists in src/content/, it must be on the page.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { App } from "./App";
import { books } from "@/content/books";

describe("book map SPA", () => {
  afterEach(cleanup);

  it("opens on the first book with every chapter on the page", () => {
    render(<App />);
    const bookOne = books[0];
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${bookOne.title} Ladder`);
    for (const chapter of bookOne.chapters) {
      expect(screen.getByRole("heading", { level: 2, name: chapter.title })).toBeTruthy();
    }
    // Every shipped lesson is in the ladder, teaching rows and checkpoints alike.
    for (const lesson of bookOne.lessons.filter((l) => !l.checkpoint)) {
      expect(screen.getAllByText(lesson.title).length).toBeGreaterThan(0);
    }
  });

  it("offers one book chip per book and one rail jump per chapter", () => {
    render(<App />);
    const bookNav = screen.getByRole("navigation", { name: "Books" });
    expect(within(bookNav).getAllByRole("button")).toHaveLength(books.length);
    const rail = screen.getByRole("navigation", { name: "Chapters" });
    expect(within(rail).getAllByRole("button")).toHaveLength(books[0].chapters.length);
  });
});
