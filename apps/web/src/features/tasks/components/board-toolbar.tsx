"use client";

import { ListFilter, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardFilters } from "@/features/tasks/hooks/use-board-filters";
import { TASK_DUE_FILTER_LABEL, TASK_DUE_FILTERS, UNASSIGNED_FILTER } from "@/lib/task-filters";
import type { UserSummary } from "@/types/user";

interface BoardToolbarProps {
  /** Project members, for the Assignee filter. */
  members: UserSummary[];
  /** Labels used on the board, for the Label filter. */
  labels: string[];
  /** Opens AddTaskDialog for the To Do column. */
  onAddTask: () => void;
}

/** Search, Filters menu and Add Task above the Kanban board. */
export function BoardToolbar({ members, labels, onAddTask }: BoardToolbarProps) {
  const { filters, setSearch, toggleFilter, clearFilters, activeFilterCount } = useBoardFilters();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput value={filters.q ?? ""} onSearch={setSearch} placeholder="Search tasks..." />

      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="h-10 flex-1 bg-card px-4 sm:flex-none">
              <ListFilter data-icon="inline-start" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
                  <span className="sr-only">, active: </span>
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-h-(--radix-dropdown-menu-content-available-height) w-56"
          >
            <FilterGroup label="Assignee">
              {members.map((member) => (
                <FilterItem
                  key={member.id}
                  checked={filters.assignee.includes(member.id)}
                  onToggle={() => toggleFilter("assignee", member.id)}
                >
                  {member.name}
                </FilterItem>
              ))}
              <FilterItem
                checked={filters.assignee.includes(UNASSIGNED_FILTER)}
                onToggle={() => toggleFilter("assignee", UNASSIGNED_FILTER)}
              >
                Unassigned
              </FilterItem>
            </FilterGroup>

            {labels.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <FilterGroup label="Label">
                  {labels.map((label) => (
                    <FilterItem
                      key={label}
                      checked={filters.label.includes(label)}
                      onToggle={() => toggleFilter("label", label)}
                    >
                      {label}
                    </FilterItem>
                  ))}
                </FilterGroup>
              </>
            )}

            <DropdownMenuSeparator />
            <FilterGroup label="Due date">
              {TASK_DUE_FILTERS.map((due) => (
                <FilterItem
                  key={due}
                  checked={filters.due.includes(due)}
                  onToggle={() => toggleFilter("due", due)}
                >
                  {TASK_DUE_FILTER_LABEL[due]}
                </FilterItem>
              ))}
            </FilterGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={activeFilterCount === 0} onSelect={clearFilters}>
              Clear filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="lg" className="h-10 flex-1 px-4 sm:flex-none" onClick={onAddTask}>
          <Plus data-icon="inline-start" />
          Add Task
        </Button>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground">{label}</DropdownMenuLabel>
      {children}
    </DropdownMenuGroup>
  );
}

function FilterItem({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      onCheckedChange={onToggle}
      // Keep the menu open, so several filters can be picked in a row.
      onSelect={(event) => event.preventDefault()}
    >
      {children}
    </DropdownMenuCheckboxItem>
  );
}
