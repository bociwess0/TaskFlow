"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type KeyboardEvent, useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "@/features/tasks/hooks/use-add-comment";
import { type CommentFormValues, commentFormSchema } from "@/features/tasks/schemas";

/** Comment box under the task's comments. Ctrl/Cmd+Enter sends; the field stays focused. */
export function CommentForm({ taskId }: { taskId: string }) {
  const id = useId();
  const addComment = useAddComment(taskId);
  const { register, handleSubmit, reset, setFocus, getValues, setValue, control, formState } =
    useForm<CommentFormValues>({
      resolver: zodResolver(commentFormSchema),
      defaultValues: { content: "" },
    });
  const error = formState.errors.content;
  const isBlank = useWatch({ control, name: "content" }).trim() === "";

  // The comment shows at once (optimistic), so the field is cleared without waiting for the save.
  const onSubmit = handleSubmit(({ content }) => {
    // mutateAsync rejects for every failed comment (mutate's callbacks only run for the last one).
    // The hook already shows the error toast; here the text goes back into the field, unless
    // something new has been typed there in the meantime.
    addComment.mutateAsync(content).catch(() => {
      if (getValues("content").trim() === "") {
        setValue("content", content);
      }
    });
    reset();
    setFocus("content");
  });

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      // A blank comment isn't sent, and pressing the shortcut shouldn't show an error either.
      if (!isBlank) onSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor={`${id}-content`} className="sr-only">
          Comment
        </FieldLabel>
        <Textarea
          id={`${id}-content`}
          rows={3}
          placeholder="Write a comment..."
          className="bg-card"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-content-error` : undefined}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          onKeyDown={onKeyDown}
          {...register("content")}
        />
        <FieldError id={`${id}-content-error`} errors={[error]} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={isBlank}>
          Comment
        </Button>
      </div>
    </form>
  );
}
