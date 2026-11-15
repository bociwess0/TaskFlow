import {
  BookOpen,
  CodeXml,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  type LucideIcon,
  PenTool,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectLink, ProjectLinkType } from "@/types/project";

/** lucide has no brand icons, so GitHub and Figma use neutral code and design icons. */
const LINK_ICON: Record<ProjectLinkType, LucideIcon> = {
  github: CodeXml,
  figma: PenTool,
  docs: BookOpen,
  preview: Globe,
  other: LinkIcon,
};

interface QuickLinksCardProps {
  links: ProjectLink[];
}

/** External project links: repository, design, docs, preview (Overview tab). */
export function QuickLinksCard({ links }: QuickLinksCardProps) {
  return (
    <Card className="gap-4 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle className="font-semibold">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <EmptyState message="No links yet." />
        ) : (
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.id}>
                <QuickLinkRow link={link} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function QuickLinkRow({ link }: { link: ProjectLink }) {
  const Icon = LINK_ICON[link.type];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate font-medium text-primary group-hover:underline">
        {link.label}
      </span>
      <span className="sr-only">(opens in a new tab)</span>
      <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </a>
  );
}
