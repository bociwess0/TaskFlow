import { SidebarContent } from "@/components/layout/sidebar-content";

/** Fixed sidebar for desktop; on smaller screens the same content opens in MobileSidebar. */
export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
      <SidebarContent />
    </aside>
  );
}
