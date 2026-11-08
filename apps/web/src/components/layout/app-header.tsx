import { Search } from "lucide-react";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { NotificationsButton } from "@/components/layout/notifications-button";
import { UserMenu } from "@/components/layout/user-menu";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <MobileSidebar />

      <div className="relative w-full max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          className="h-10 border-transparent bg-transparent pl-9 shadow-none focus-visible:bg-card"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <NotificationsButton />
        <UserMenu />
      </div>
    </header>
  );
}
