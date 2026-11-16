"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "@/features/tasks/components/task-form";
import { useCreateTask } from "@/features/tasks/hooks/use-create-task";
import { getTaskFormDefaults, toTaskInput } from "@/features/tasks/schemas";
import type { TaskStatus } from "@/types/task";
import type { UserSummary } from "@/types/user";

interface AddTaskDialogProps {
  projectId: string;
  /** Column the new task goes to; null keeps the dialog closed. */
  status: TaskStatus | null;
  onClose: () => void;
  members: UserSummary[];
  labels: string[];
}

/** Dialog for creating a task. The form mounts on open, so it always starts empty. */
export function AddTaskDialog({ projectId, status, onClose, members, labels }: AddTaskDialogProps) {
  return (
    <Dialog open={status !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90svh] overflow-y-auto sm:max-w-lg"
        // The form focuses Title itself.
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add task</DialogTitle>
          <DialogDescription>New tasks go to the end of the selected column.</DialogDescription>
        </DialogHeader>
        {status && (
          <AddTaskForm
            projectId={projectId}
            status={status}
            members={members}
            labels={labels}
            onCreated={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface AddTaskFormProps {
  projectId: string;
  status: TaskStatus;
  members: UserSummary[];
  labels: string[];
  onCreated: () => void;
}

function AddTaskForm({ projectId, status, members, labels, onCreated }: AddTaskFormProps) {
  const createTask = useCreateTask(projectId);

  return (
    <TaskForm
      defaultValues={getTaskFormDefaults(status)}
      members={members}
      labels={labels}
      // On error the dialog stays open with the entered values; the toast explains what failed.
      onSubmit={(values) => createTask.mutate(toTaskInput(values), { onSuccess: onCreated })}
      actions={
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="lg" className="h-10 px-4">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="lg" className="h-10 px-4" disabled={createTask.isPending}>
            {createTask.isPending ? "Creating..." : "Create task"}
          </Button>
        </DialogFooter>
      }
    />
  );
}
