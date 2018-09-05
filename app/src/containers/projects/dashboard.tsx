import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { ClaimFrequency, ProjectDto } from "../../models";
import { Pending } from "../../shared/pending";
import { routeConfig } from "../../routing";
import * as Actions from "../../redux/actions/contacts";

interface Data {
  projects: Pending<ProjectDto[]>;
}

interface Callbacks {
}

class ProjectDashboardComponent extends ContainerBase<Data, Callbacks> {

  static getLoadDataActions() {
    return [Actions.loadProjects()];
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
    const open: JSX.Element[]     = [];
    const awaiting: JSX.Element[] = [];
    const archived: JSX.Element[] = [];

    projects.forEach(x => {
      const quarterly  = x.claimFrequency === ClaimFrequency.Quarterly;
      const frequency  = quarterly ? 4 : 12;
      const periodText = quarterly ? "Quarter" : "Period";
      const today      = new Date();
      // needs last claim date to work out latest period for claim deadline
      const end        = new Date(x.startDate);
      const endMonth   = x.period * (quarterly ? 4 : 1);
      end.setMonth(end.getMonth() + endMonth);
      end.setDate(0);
      const timeRemaining = end.getTime() - today.getTime();
      const daysRemaining = Math.floor(timeRemaining / (60 * 60 * 24 * 1000));

      if(daysRemaining <= 30) {
        open.push((
          <ACC.OpenProjectItem
            project={x}
            daysRemaining={daysRemaining}
            endDate={end}
            frequency={frequency}
            periodText={periodText}
            warning={true}
          />
        ));
      }
      else {
        const nextStart = new Date(end);
        nextStart.setDate(1);

        awaiting.push((
          <ACC.AwaitingProjectItem
            project={x}
            frequency={frequency}
            periodText={periodText}
            warning={false}
            periodStart={nextStart}
            periodEnd={end}
          />
        ));
      }
    });

    return (
      <React.Fragment>
        <ACC.ListSection title="Projects with open claims">
          {this.renderProjects(open, "You currently do not have any projects with open claims.")}
        </ACC.ListSection>
        <ACC.ListSection title="Projects awaiting the next claim period">
          {this.renderProjects(awaiting, "You currently do not have any projects outside of the claims period.")}
        </ACC.ListSection>
        <ACC.ListSection title="Archived projects">
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

export const ProjectDashboard = ReduxContainer.for<Data, Callbacks>(ProjectDashboardComponent)
// TODO - key below
  .withData(state => ({ projects: Pending.create(state.data.projects.all) }))
  .connect()
  ;
