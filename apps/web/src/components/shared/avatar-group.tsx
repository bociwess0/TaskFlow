import { UserAvatar } from "@/components/shared/user-avatar";
import { AvatarGroupCount, AvatarGroup as AvatarStack } from "@/components/ui/avatar";
import type { UserSummary } from "@/types/user";

interface AvatarGroupProps {
  users: UserSummary[];
  /** How many avatars to show before collapsing the rest into "+N". */
  max?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function AvatarGroup({ users, max = 3, size = "default", className }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const hiddenCount = users.length - visible.length;

  return (
    <AvatarStack
      className={className}
      role="group"
      aria-label={users.map((user) => user.name).join(", ")}
    >
      {visible.map((user) => (
        <UserAvatar key={user.id} user={user} size={size} />
      ))}
      {hiddenCount > 0 && (
        <AvatarGroupCount className="text-xs font-medium">+{hiddenCount}</AvatarGroupCount>
      )}
    </AvatarStack>
  );
}
