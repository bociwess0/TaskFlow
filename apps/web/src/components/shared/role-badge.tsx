import { Badge } from "@/components/ui/badge";
import { ROLE_LABEL, ROLE_TONE } from "@/lib/user-role";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/user";

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

/** System role of a user. The job title is not a badge; it is shown as plain text. */
export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge variant={ROLE_TONE[role]} className={cn("h-6 rounded-md px-2.5 text-xs", className)}>
      {ROLE_LABEL[role]}
    </Badge>
  );
}
