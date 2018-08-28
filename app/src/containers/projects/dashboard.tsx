import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { ProjectDto } from "../../models";
import { Pending } from "../../shared/pending";
import { routeConfig } from "../../routing";
import * as Actions from "../../redux/actions/contacts";

interface Data {
  projects: Pending<ProjectDto[]>;
}

interface Callbacks {
  loadProjects: () => void;
}

class ProjectDashboardComponent extends ContainerBase<Data, Callbacks> {
  componentDidMount() {
    this.props.loadProjects();
  }

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
        <ACC.ListSection title="Projects with open claims">
          {this.renderProjects(open, "You currently do not have any projects with open claims.")}
        </ACC.ListSection>
        <ACC.ListSection title="Projects awaiting the next claim period">
          {this.renderProjects(awaiting, "You currently do not have any projects awaiting the next claim period.")}
        </ACC.ListSection>
        <ACC.ListSection title="Archived projects">
          {this.renderProjects(archived, "You currently do not have any archived projects.")}
        </ACC.ListSection>
      </React.Fragment>
    );
  }

  renderProjects(projects: ProjectDto[], emptyMessage: string) {
    return projects.length > 0
      ? projects.map((x, i) => <ACC.ProjectItem key={i} project={x} />)
      : <ACC.ListItem><p className="govuk-body">{emptyMessage}</p></ACC.ListItem>;
  }
}

export const ProjectDashboard = ReduxContainer.for<Data, Callbacks>(ProjectDashboardComponent)
// TODO - key below
  .withData(state => ({ projects: Pending.create(state.data.projects.all) }))
  .withCallbacks(dispatch => ({ loadProjects: () => dispatch(Actions.loadProjects()) }))
  .connect();
