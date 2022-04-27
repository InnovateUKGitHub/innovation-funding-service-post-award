import { ProjectDto } from "@framework/types";
import { PageTitle } from "@ui/features/page-title";

export interface TitleProps extends Pick<ProjectDto, "projectNumber" | "title"> {
  heading?: string;
}

export function Title({ projectNumber, title, heading }: TitleProps) {
  const captionValue = `${projectNumber} : ${title}`;

  return <PageTitle  caption={captionValue} title={heading}/>;
}
