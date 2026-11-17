import { useId } from "react";
import { useFetcher } from "react-router";
import { NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { formatRelativeTime } from "~/lib/utils";

export type LessonNote = { body: string; updatedAt: string };

function NoteStatus({
  id,
  error,
  updatedAt,
}: {
  id: string;
  error?: string;
  updatedAt?: string;
}) {
  if (error) {
    return (
      <p id={id} role="alert" className="mr-auto text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <output className="mr-auto text-xs text-muted-foreground">
      {updatedAt && (
        <time dateTime={updatedAt} suppressHydrationWarning>
          Last edited {formatRelativeTime(updatedAt)}
        </time>
      )}
    </output>
  );
}

export function LessonNoteEditor({ note }: { note: LessonNote | null }) {
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const privacyId = `${idPrefix}-privacy`;
  const errorId = `${idPrefix}-error`;
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const error = isSaving ? undefined : fetcher.data?.error;

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-t-xl bg-muted/40 p-4 sm:p-6"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg border bg-background p-2 text-primary">
          <NotebookPen aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 id={titleId} className="text-xl font-semibold">
            Your notes
          </h2>
          <p id={privacyId} className="text-sm text-muted-foreground">
            Only you can see these notes.
          </p>
        </div>
      </div>
      <fetcher.Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="save-note" />
        <Textarea
          name="body"
          aria-labelledby={titleId}
          aria-describedby={error ? `${privacyId} ${errorId}` : privacyId}
          aria-invalid={error ? true : undefined}
          defaultValue={note?.body ?? ""}
          placeholder="Jot down a takeaway or something to revisit…"
          className="max-h-80 min-h-24 resize-y bg-background dark:bg-background"
        />
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
          <NoteStatus id={errorId} error={error} updatedAt={note?.updatedAt} />
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save note"}
          </Button>
        </div>
      </fetcher.Form>
    </section>
  );
}
