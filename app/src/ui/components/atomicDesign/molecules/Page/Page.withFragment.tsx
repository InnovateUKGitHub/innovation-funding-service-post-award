import { Page as PageComponent } from "./Page";
import { Title } from "../../organisms/projects/ProjectTitle/title";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { PageFragment$data, PageFragment$key } from "./__generated__/PageFragment.graphql";
import { useFragment } from "react-relay";
import { pageFragment } from "./Page.fragment";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import React from "react";
import { IAppError } from "@framework/types/IAppError";

type PageWithFragmentProps = {
  backLink?: React.ReactNode;
  fragmentRef: unknown;
  children: React.ReactNode;
  apiError?: IAppError | null;
  validationErrors?: RhfErrors;
  qa?: string;
  className?: string;
  bailoutErrorNavigation?: boolean;
  partnerId?: PartnerId;
  heading?: string;
};

export const Page = ({ fragmentRef, children, heading, ...props }: PageWithFragmentProps) => {
  if (!isValidFragmentKey<PageFragment$key>(fragmentRef, "PageFragment")) {
    throw new Error("Page is missing a PageFragment reference");
  }

  const fragment: PageFragment$data = useFragment(pageFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.Page?.edges);

  const project = mapToProjectDto(projectNode, ["id", "projectNumber", "title", "status", "isActive"]);

  return (
    <PageComponent
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} heading={heading} />}
      fragmentRef={fragmentRef}
      projectId={project.id}
      isActive={project.isActive}
      {...props}
    >
      {children}
    </PageComponent>
  );
};
