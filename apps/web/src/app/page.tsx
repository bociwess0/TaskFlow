import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Temporary page to verify the theme. Replaced by the app layout and Dashboard in the next step.
export default function ThemePreviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 sm:p-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
        <p className="text-muted-foreground">Theme preview</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Primary actions and variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button size="lg">
            <Plus data-icon="inline-start" />
            New Project
          </Button>
          <Button size="lg" variant="outline">
            Filters
          </Button>
          <Button size="lg" variant="secondary">
            Secondary
          </Button>
          <Button size="lg" variant="ghost">
            Ghost
          </Button>
          <Button size="lg" variant="destructive">
            Delete
          </Button>
          <Button size="lg" variant="link">
            View all
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Status colors from the design</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="success">Completed</Badge>
          <Badge variant="info">In Progress</Badge>
          <Badge variant="warning">Planning</Badge>
          <Badge variant="danger">On Hold</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="success">Available</Badge>
          <Badge variant="danger">Overallocated</Badge>
          <Badge variant="highlight">design</Badge>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 rounded-xl bg-sidebar p-4 text-sidebar-foreground">
        <span className="rounded-lg bg-sidebar-primary px-3 py-2 text-sm font-medium text-sidebar-primary-foreground">
          Dashboard
        </span>
        <span className="text-sm">Projects</span>
        <span className="text-sm">Tasks</span>
      </div>
    </main>
  );
}
