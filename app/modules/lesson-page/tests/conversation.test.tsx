import { renderToStaticMarkup } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { LessonConversation } from "../conversation";

const savedNote = {
  body: "Review cursor pagination.",
  updatedAt: "2025-01-01T00:00:00Z",
};

function renderConversation(
  currentUserId: number | null,
  note: typeof savedNote | null = null
) {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <LessonConversation
          lessonId={30}
          currentUserId={currentUserId}
          note={note}
          comments={[]}
          canModerate={false}
          instructorName="Marcus Johnson"
        />
      ),
    },
  ]);
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe("lesson conversation", () => {
  it("shows the saved private note above Discussion and keeps the submissions separate", () => {
    const html = renderConversation(1, savedNote);
    const forms = html.match(/<form\b.*?<\/form>/g) ?? [];

    expect(forms).toHaveLength(2);
    expect(forms[0]).toContain('value="save-note"');
    expect(forms[0]).toContain("Review cursor pagination.");
    expect(forms[0]).toContain("Save note");
    expect(forms[1]).toContain('value="create-comment"');
    expect(forms[1]).not.toContain("Review cursor pagination.");
    expect(html).toContain("Only you can see these notes.");
    expect(html).toContain('dateTime="2025-01-01T00:00:00Z"');
    expect(html).toContain("Last edited");
  });

  it("offers an empty note editor without a last-edited message on a new lesson", () => {
    const html = renderConversation(1);
    const titleId = html.match(/<h2 id="([^"]+)"[^>]*>Your notes<\/h2>/)?.[1];
    const privacyId = html.match(
      /<p id="([^"]+)"[^>]*>Only you can see these notes\.<\/p>/
    )?.[1];

    expect(titleId).toBeTruthy();
    expect(privacyId).toBeTruthy();
    const editor = html.match(/<textarea[^>]*><\/textarea>/)?.[0];
    expect(editor).toContain(
      'placeholder="Jot down a takeaway or something to revisit…"'
    );
    expect(editor).toContain(`aria-labelledby="${titleId}"`);
    expect(editor).toContain(`aria-describedby="${privacyId}"`);
    expect(html).not.toContain("Last edited");
  });

  it("shows Discussion without a note editor when signed out", () => {
    const html = renderConversation(null, savedNote);

    expect(html).toContain("Questions &amp; Discussion");
    expect(html).not.toContain("Your notes");
    expect(html).not.toContain('value="save-note"');
    expect(html).not.toContain(savedNote.body);
  });
});
