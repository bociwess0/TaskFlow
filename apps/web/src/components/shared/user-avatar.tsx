import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import type { UserSummary } from "@/types/user";

interface UserAvatarProps {
  user: Pick<UserSummary, "name" | "avatarUrl">;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function UserAvatar({ user, size = "default", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
      <AvatarFallback className="bg-secondary font-medium text-secondary-foreground">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
