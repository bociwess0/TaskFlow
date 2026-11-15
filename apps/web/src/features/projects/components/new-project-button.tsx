import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens project creation once it exists; shared by the page header and the empty state. */
export function NewProjectButton() {
  return (
    <Button size="lg" className="h-10 px-4">
      <Plus data-icon="inline-start" />
      New Project
    </Button>
  );
}
