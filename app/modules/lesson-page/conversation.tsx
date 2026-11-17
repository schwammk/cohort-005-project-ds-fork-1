import { NotebookPen } from "lucide-react";
import {
  CommentThread,
  type RenderedComment,
} from "~/components/comment-thread";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  LessonNoteEditor,
  lessonNoteEditorId,
  type LessonNote,
} from "./lib/lesson-note-editor";

export function LessonNotesLink() {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={`#${lessonNoteEditorId}`}>
        <NotebookPen aria-hidden="true" />
        Your notes
      </a>
    </Button>
  );
}

export function LessonConversation({
  lessonId,
  note,
  comments,
  currentUserId,
  canModerate,
  instructorName,
}: {
  lessonId: number;
  note: LessonNote | null;
  comments: RenderedComment[];
  currentUserId: number | null;
  canModerate: boolean;
  instructorName: string;
}) {
  return (
    <Card className="mb-8 gap-0 divide-y py-0">
      {currentUserId !== null && (
        <LessonNoteEditor key={`${lessonId}:${currentUserId}`} note={note} />
      )}
      <CommentThread
        comments={comments}
        currentUserId={currentUserId}
        canModerate={canModerate}
        canPost
        instructorName={instructorName}
      />
    </Card>
  );
}
