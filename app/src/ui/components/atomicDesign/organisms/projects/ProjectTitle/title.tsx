import { ProjectDto } from "@framework/dtos/projectDto";
import { PageTitle } from "@ui/features/page-title";

export interface TitleProps extends Pick<ProjectDto, "projectNumber" | "title"> {
  heading?: string;
}

/**
 * Title Component
 */
export function Title({ projectNumber, title, heading }: TitleProps) {
  const captionValue = `${projectNumber} : ${title}`;

  return <PageTitle caption={captionValue} title={heading} />;
}
