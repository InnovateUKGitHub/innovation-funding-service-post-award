import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { HomeRoute } from "../home";
import { ClaimFrequency, ProjectDto } from "../../../types";

interface Data {
  projects: Pending<ProjectDto[]>;
}

interface Callbacks {
}

class ProjectDashboardComponent extends ContainerBase<{}, Data, Callbacks> {

  render() {
    const Loader = ACC.TypedLoader<ProjectDto[]>();
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={HomeRoute.getLink({})}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Title title="Projects dashboard" />
        <Loader pending={this.props.projects} render={x => this.renderSubSections(x)} />
      </ACC.Page>
    );
  }

  renderSubSections(projects: ProjectDto[]) {
    const open: JSX.Element[] = [];
    const awaiting: JSX.Element[] = [];
    const archived: JSX.Element[] = [];

    projects.forEach(x => {
      const quarterly = x.claimFrequency === ClaimFrequency.Quarterly;
      const today = new Date();
      // needs last claim date to work out latest period for claim deadline
      const end = new Date(x.startDate);
      const endMonth = x.periodId * (quarterly ? 4 : 1);
      end.setMonth(end.getMonth() + endMonth);
      end.setDate(0);
      const timeRemaining = end.getTime() - today.getTime();
      const daysRemaining = Math.floor(timeRemaining / (60 * 60 * 24 * 1000));

      if (daysRemaining <= 30) {
        open.push((
          <ACC.OpenProjectItem
            key={x.id}
            project={x}
            daysRemaining={daysRemaining}
            endDate={end}
            warning={true}
          />
        ));
      }
      else {
        const nextStart = new Date(end);
        nextStart.setDate(1);

        awaiting.push((
          <ACC.AwaitingProjectItem
            key={x.id}
            project={x}
            warning={false}
            periodStart={nextStart}
            periodEnd={end}
          />
        ));
      }
    });

    return (
      <React.Fragment>
        <ACC.ListSection title="Projects with open claims" qa="Projects-with-open-claims">
          {this.renderProjects(open, "You currently do not have any projects with open claims.")}
        </ACC.ListSection>
        <ACC.ListSection title="Projects awaiting the next claim period" qa="Projects-awaiting-next-claims-period">
          {this.renderProjects(awaiting, "You currently do not have any projects outside of the claims period.")}
        </ACC.ListSection>
        <ACC.ListSection title="Archived projects" qa="Archived-projects">
          {this.renderProjects(archived, "You currently do not have any archived projects.")}
        </ACC.ListSection>
      </React.Fragment>
    );
  }

  renderProjects(projects: JSX.Element[], emptyMessage: string) {
    return projects.length > 0
      ? projects
      : <ACC.ListItem><p className="govuk-body govuk-!-margin-0">{emptyMessage}</p></ACC.ListItem>;
  }
}

const definition = ReduxContainer.for<{}, Data, Callbacks>(ProjectDashboardComponent);

export const ProjectDashboard = definition.connect({
  withData: (state, props) => ({projects: Selectors.getProjects().getPending(state) }),
  withCallbacks: () => ({})
});

export const ProjectDashboardRoute = definition.route({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  getParams: () => ({}),
  getLoadDataActions: (params) => [Actions.loadProjects()],
  container: ProjectDashboard
});
