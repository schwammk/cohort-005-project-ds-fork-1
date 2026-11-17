import {
  CommentThread,
  type RenderedComment,
} from "~/components/comment-thread";
import { Card } from "~/components/ui/card";
import { LessonNoteEditor } from "./lib/lesson-note-editor";

export function LessonConversation({
  lessonId,
  note,
  comments,
  currentUserId,
  canModerate,
  instructorName,
}: {
  lessonId: number;
  note: { body: string; updatedAt: string } | null;
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
