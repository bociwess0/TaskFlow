import { applyTaskMove, compareTasks } from "@/lib/task-move";
import { ApiError } from "@/services/api-error";
import { dateFromToday, minutesAgo } from "@/services/mock/dates";
import { mockUsers } from "@/services/mock/users";
import { mockError, mockResponse } from "@/services/mock-response";
import { mockProjectExists } from "@/services/projects-service";
import type { Task, TaskComment, TaskMove } from "@/types/task";

const { ana, bogdan, ivan, jelena, marko, nikola, sara } = mockUsers;

let tasks: Task[] = [
  // E-commerce Platform (p-1), as on the Kanban design
  {
    id: "t-1",
    projectId: "p-1",
    title: "Create wireframes",
    description: "Low-fidelity wireframes for the catalog, product and checkout pages.",
    status: "TODO",
    priority: "HIGH",
    labels: ["design"],
    assignee: ana,
    dueDate: dateFromToday(9),
    estimatedHours: 12,
    position: 0,
    createdAt: dateFromToday(-12),
  },
  {
    id: "t-2",
    projectId: "p-1",
    title: "Setup development environment",
    description: "Docker setup, environment variables and onboarding notes for the team.",
    status: "TODO",
    priority: "MEDIUM",
    labels: ["development"],
    assignee: marko,
    dueDate: dateFromToday(10),
    estimatedHours: 6,
    position: 1,
    createdAt: dateFromToday(-11),
  },
  {
    id: "t-3",
    projectId: "p-1",
    title: "Write technical specification",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    labels: ["documentation"],
    assignee: jelena,
    dueDate: dateFromToday(12),
    estimatedHours: 8,
    position: 2,
    createdAt: dateFromToday(-10),
  },
  {
    id: "t-4",
    projectId: "p-1",
    title: "Research competitors",
    description: "Compare checkout flows and pricing pages of the top five competitors.",
    status: "TODO",
    priority: "LOW",
    labels: ["research"],
    assignee: jelena,
    dueDate: dateFromToday(14),
    estimatedHours: null,
    position: 3,
    createdAt: dateFromToday(-9),
  },
  {
    id: "t-5",
    projectId: "p-1",
    title: "Design system components",
    description: "Buttons, inputs, cards and badges in Figma, matched with Tailwind tokens.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    labels: ["design"],
    assignee: sara,
    dueDate: dateFromToday(8),
    estimatedHours: 16,
    position: 0,
    createdAt: dateFromToday(-15),
  },
  {
    id: "t-6",
    projectId: "p-1",
    title: "Homepage implementation",
    description: "Hero, featured products and newsletter sections.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    labels: ["development"],
    assignee: nikola,
    dueDate: dateFromToday(11),
    estimatedHours: 20,
    position: 1,
    createdAt: dateFromToday(-14),
  },
  {
    id: "t-7",
    projectId: "p-1",
    title: "SEO optimization",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    labels: ["marketing"],
    assignee: sara,
    dueDate: dateFromToday(15),
    estimatedHours: 6,
    position: 2,
    createdAt: dateFromToday(-13),
  },
  {
    id: "t-8",
    projectId: "p-1",
    title: "Mobile responsive design",
    description: "Check every page on small screens and fix layout issues.",
    status: "REVIEW",
    priority: "HIGH",
    labels: ["design"],
    assignee: ana,
    // Overdue, so the board can show a late task
    dueDate: dateFromToday(-1),
    estimatedHours: 10,
    position: 0,
    createdAt: dateFromToday(-18),
  },
  {
    id: "t-9",
    projectId: "p-1",
    title: "Performance testing",
    description: "Lighthouse and load tests for the catalog and checkout.",
    status: "REVIEW",
    priority: "MEDIUM",
    labels: ["testing"],
    assignee: marko,
    dueDate: dateFromToday(13),
    estimatedHours: 8,
    position: 1,
    createdAt: dateFromToday(-16),
  },
  {
    id: "t-10",
    projectId: "p-1",
    title: "Project setup",
    description: "Repository, CI pipeline and code style.",
    status: "DONE",
    priority: "HIGH",
    labels: ["development"],
    assignee: marko,
    dueDate: dateFromToday(-18),
    estimatedHours: 4,
    position: 0,
    createdAt: dateFromToday(-22),
  },
  {
    id: "t-11",
    projectId: "p-1",
    title: "Database schema",
    description: "",
    status: "DONE",
    priority: "HIGH",
    labels: ["backend"],
    assignee: nikola,
    dueDate: dateFromToday(-12),
    estimatedHours: 8,
    position: 1,
    createdAt: dateFromToday(-21),
  },
  {
    id: "t-12",
    projectId: "p-1",
    title: "User authentication",
    description: "Sign up, login and password reset with JWT.",
    status: "DONE",
    priority: "URGENT",
    labels: ["backend"],
    assignee: marko,
    dueDate: dateFromToday(-5),
    estimatedHours: 12,
    position: 2,
    createdAt: dateFromToday(-20),
  },

  // Mobile App (p-2)
  {
    id: "t-13",
    projectId: "p-2",
    title: "Push notification service",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    labels: ["backend"],
    assignee: null,
    dueDate: dateFromToday(20),
    estimatedHours: null,
    position: 0,
    createdAt: dateFromToday(-6),
  },
  {
    id: "t-14",
    projectId: "p-2",
    title: "Beta feedback fixes",
    description: "Fix issues reported by beta testers.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    labels: ["development"],
    assignee: sara,
    dueDate: dateFromToday(4),
    estimatedHours: 10,
    position: 0,
    createdAt: dateFromToday(-8),
  },
  {
    id: "t-15",
    projectId: "p-2",
    title: "App store screenshots",
    description: "",
    status: "REVIEW",
    priority: "LOW",
    labels: ["design"],
    assignee: ivan,
    dueDate: dateFromToday(6),
    estimatedHours: 3,
    position: 0,
    createdAt: dateFromToday(-7),
  },
  {
    id: "t-16",
    projectId: "p-2",
    title: "Offline mode",
    description: "",
    status: "DONE",
    priority: "MEDIUM",
    labels: ["development"],
    assignee: bogdan,
    dueDate: dateFromToday(-3),
    estimatedHours: 14,
    position: 0,
    createdAt: dateFromToday(-30),
  },
];

/**
 * Tasks of one project, ordered by status column and position.
 * Rejects with a 404 ApiError for an unknown project, the same way the API will respond.
 */
export function getProjectTasks(projectId: string): Promise<Task[]> {
  if (!mockProjectExists(projectId)) {
    return mockError(new ApiError(404, `Project ${projectId} not found`));
  }

  // Copies, so later mock changes never mutate data already handed to the UI.
  const result = tasks
    .filter((task) => task.projectId === projectId)
    .sort(compareTasks)
    .map((task) => ({ ...task }));

  return mockResponse(result);
}

/**
 * Moves a task to another column and/or position (PATCH /tasks/:id/move).
 * Like the API, it renumbers positions in the old and the new column.
 */
export function moveTask(move: TaskMove): Promise<Task> {
  const task = tasks.find((item) => item.id === move.taskId);
  if (!task) {
    return mockError(new ApiError(404, `Task ${move.taskId} not found`));
  }

  const projectTasks = applyTaskMove(
    tasks.filter((item) => item.projectId === task.projectId),
    move,
  );
  tasks = [...tasks.filter((item) => item.projectId !== task.projectId), ...projectTasks];

  const updated = projectTasks.find((item) => item.id === move.taskId) ?? task;
  return mockResponse({ ...updated });
}

const comments: TaskComment[] = [
  {
    id: "c-1",
    taskId: "t-5",
    author: jelena,
    content: "I added the button and input variants to Figma. Can someone check the focus states?",
    createdAt: minutesAgo(3 * 24 * 60),
  },
  {
    id: "c-2",
    taskId: "t-5",
    author: sara,
    content: "Looks good. The disabled state needs a bit more contrast, I'll update it today.",
    createdAt: minutesAgo(26 * 60),
  },
  {
    id: "c-3",
    taskId: "t-5",
    author: ana,
    content: "Badges are done too, so cards can use them now.",
    createdAt: minutesAgo(45),
  },
  {
    id: "c-4",
    taskId: "t-6",
    author: nikola,
    content: "Hero section is in. Waiting for final product photos for the featured grid.",
    createdAt: minutesAgo(5 * 60),
  },
  {
    id: "c-5",
    taskId: "t-8",
    author: marko,
    content: "Checkout breaks below 360px, the summary box overflows.",
    createdAt: minutesAgo(2 * 24 * 60),
  },
  {
    id: "c-6",
    taskId: "t-8",
    author: ana,
    content: "Fixed it, ready for another look.",
    createdAt: minutesAgo(20 * 60),
  },
  {
    id: "c-7",
    taskId: "t-1",
    author: jelena,
    content: "Please include the empty cart state in the wireframes.",
    createdAt: minutesAgo(4 * 24 * 60),
  },
];

/**
 * Comments of one task, oldest first.
 * Rejects with a 404 ApiError for an unknown task, the same way the API will respond.
 */
export function getTaskComments(taskId: string): Promise<TaskComment[]> {
  if (!tasks.some((task) => task.id === taskId)) {
    return mockError(new ApiError(404, `Task ${taskId} not found`));
  }

  const result = comments
    .filter((comment) => comment.taskId === taskId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((comment) => ({ ...comment }));

  return mockResponse(result);
}
