import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { RootState } from "../../redux";
import * as ACC from "../../components";
import { ProjectDto } from "../../models";
import { Pending } from "../../shared/pending";
import { routeConfig } from "../../routing";

interface Data {
  projects: Pending<ProjectDto[]>;
}

interface Callbacks {

}

class ProjectDashboardComponent extends ContainerBase<Data, Callbacks> {
  render() {
    const Loading = ACC.Loading.forData(this.props.projects);

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.home}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Title title="Projects Dashboard" />
        <Loading.Loader render={x => this.renderSubSections(x)} />
      </ACC.Page>
    );
  }

  renderSubSections(projects: ProjectDto[]) {
    const open     = projects.filter(x => true);
    const awaiting = projects.filter(x => false);
    const archived = projects.filter(x => false);

    return (
      <React.Fragment>
        <ACC.SubSection title="Projects with open claims">
          {this.renderProjects(open, "You currently do not have any projects with open claims.")}
        </ACC.SubSection>
        <ACC.SubSection title="Projects awaiting the next claim period">
          {this.renderProjects(awaiting, "You currently do not have any projects awaiting the next claim period.")}
        </ACC.SubSection>
        <ACC.SubSection title="Archived projects">
          {this.renderProjects(archived, "You currently do not have any archived projects.")}
        </ACC.SubSection>
      </React.Fragment>
    );
  }

  renderProjects(projects: ProjectDto[], emptyMessage: string) {
    return projects.length > 0
      ? projects.map((x, i) => <ACC.ProjectItem key={i} project={x} />)
      : <p className="govuk-body">{emptyMessage}</p>;
  }
}

export const ProjectDashboard = ReduxContainer.for<Data, Callbacks>(ProjectDashboardComponent)
// TODO - key below
  .withData(state => ({ projects: Pending.create(state.data.projects.todo) }))
  .withCallbacks(() => ({}))
  .connect();
