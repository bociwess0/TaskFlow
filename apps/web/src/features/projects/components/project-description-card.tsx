import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectDetails } from "@/types/project";

interface ProjectDescriptionCardProps {
  project: Pick<ProjectDetails, "overview" | "technologies">;
}

/** Longer project description and technologies (Overview tab). */
export function ProjectDescriptionCard({ project }: ProjectDescriptionCardProps) {
  const { overview, technologies } = project;

  return (
    <Card className="gap-4 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle className="font-semibold">Project Description</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {overview ? (
          <p className="leading-relaxed text-muted-foreground">{overview}</p>
        ) : (
          <p className="text-muted-foreground italic">No description yet.</p>
        )}
        {technologies.length > 0 && (
          <ul aria-label="Technologies" className="flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <li key={technology}>
                <Badge variant="neutral" className="rounded-md">
                  {technology}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
