import { allSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { allProjectParticipantOrganisationTypes } from "@framework/constants/projectParticipantOrganisationType";
import { allProjectParticipantTypes } from "@framework/constants/projectParticipantTypes";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { DropdownListOption } from "@ui/components/inputs/dropdownList";
import { Info } from "@ui/components/layout/info";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { useState } from "react";
import { DeveloperProjectCreatorPage } from "./ProjectCreator.page";

const ProjectCreatorForm = createTypedForm();

/**
 * A project creation interface for creating projects in Salesforce.
 */
const ProjectCreator = () => {
  const { getContent } = useContent();

  const competitionTypeOptions = allSalesforceCompetitionTypes
    .filter(([key]) => key !== "sbri" && key !== "sbriIfs")
    .map(([key, value]) => ({
      id: value,
      value,
      displayName: getContent(x => x.enums.competitionTypes[key]),
      qa: `project_creator_competition_type_${key}`,
    }));

  const claimFrequencyOptions = [
    {
      id: "Monthly",
      value: "Monthly",
      displayName: "Monthly",
      qa: "competition_claim_frequency_monthly",
    },
    {
      id: "Quarterly",
      value: "Quarterly",
      displayName: "Quarterly",
      qa: "competition_claim_frequency_quarterly",
    },
  ];

  const impactManagementParticipationOptions = [
    {
      id: "yes",
      value: "Yes",
      displayName: "Impact Management Enabled (Yes)",
      qa: "impact_management_enabled",
    },
    {
      id: "no",
      value: "No",
      displayName: "Impact Management Disabled (No)",
      qa: "impact_management_enabled",
    },
  ];

  const participantTypeOptions = allProjectParticipantTypes
    .filter(([key]) => key !== "knowledgeBase" && key !== "rto" && key !== "other")
    .map(([key, value]) => ({
      id: key,
      value,
      displayName: getContent(x => x.enums.projectParticipantTypes[key]),
      qa: `project_creator_participant_type_${key}`,
    }));

  const participantOrgTypeOptions = allProjectParticipantOrganisationTypes.map(([key, value]) => ({
    id: key,
    value,
    displayName: getContent(x => x.enums.projectParticipantOrganisationTypes[key]),
    qa: `project_creator_participant_org_type_${key}`,
  }));

  const currentDate = new Date();

  const [projectName, setProjectName] = useState<string>("");
  const [competitionType, setCompetitionType] = useState<DropdownListOption | null>(null);
  const [claimFrequency, setClaimFrequency] = useState<DropdownListOption | null>(null);
  const [projectDuration, setProjectDuration] = useState<number>(12);
  const [participantType, setParticipantType] = useState<DropdownListOption | null>(null);
  const [participantOrgType, setParticipantOrgType] = useState<DropdownListOption | null>(null);
  const [projectId, setProjectId] = useState<number>(Math.floor(100000 + Math.random() * 899999));
  const [competitionCode, setCompetitionCode] = useState<string>(
    Math.floor(100000 + Math.random() * 899999).toString(10),
  );
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );
  const [impactManagementEnabled, setImpactManagementEnabled] = useState<DropdownListOption | null>(
    impactManagementParticipationOptions[0],
  );

  return (
    <Section title={x => x.components.projectCreator.sectionTitle}>
      <ProjectCreatorForm.Form data={{}} action={DeveloperProjectCreatorPage.routePath}>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorProjectName} />
          </SimpleString>
          <ProjectCreatorForm.String
            name="projectCreatorProjectName"
            value={() => projectName}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorProjectName)}
            update={(_, value) => setProjectName(value ?? "")}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorCompetitionType} />
          </SimpleString>
          <ProjectCreatorForm.DropdownList
            name="projectCreatorCompetitionType"
            options={competitionTypeOptions}
            value={() => competitionType}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorCompetitionType)}
            update={(_, value) => setCompetitionType(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorClaimFrequency} />
          </SimpleString>
          <ProjectCreatorForm.DropdownList
            name="projectCreatorClaimFrequency"
            options={claimFrequencyOptions}
            value={() => claimFrequency}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorClaimFrequency)}
            update={(_, value) => setClaimFrequency(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorProjectDuration} />
          </SimpleString>
          <ProjectCreatorForm.Numeric
            name="projectCreatorProjectDuration"
            width="one-third"
            value={() => projectDuration}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorProjectDuration)}
            update={(_, value) => setProjectDuration(value ?? 12)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectParticipantType} />
          </SimpleString>
          <ProjectCreatorForm.DropdownList
            name="projectParticipantType"
            options={participantTypeOptions}
            value={() => participantType}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectParticipantType)}
            update={(_, value) => setParticipantType(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectParticipantOrgType} />
          </SimpleString>
          <ProjectCreatorForm.DropdownList
            name="projectParticipantOrgType"
            options={participantOrgTypeOptions}
            value={() => participantOrgType}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectParticipantOrgType)}
            update={(_, value) => setParticipantOrgType(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorProjectId} />
          </SimpleString>
          <ProjectCreatorForm.Numeric
            name="projectCreatorProjectId"
            width="one-third"
            value={() => projectId}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorProjectId)}
            update={(_, value) => setProjectId(value ?? 0)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorCompetitionCode} />
          </SimpleString>
          <ProjectCreatorForm.String
            name="projectCreatorCompetitionCode"
            width="one-third"
            value={() => competitionCode}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorCompetitionCode)}
            update={(_, value) => setCompetitionCode(value ?? "")}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorImpactManagementParticipation} />
          </SimpleString>
          <ProjectCreatorForm.DropdownList
            name="projectCreatorImpactManagementParticipation"
            value={() => impactManagementEnabled}
            options={impactManagementParticipationOptions}
            placeholder={getContent(
              x => x.components.projectCreator.placeholderProjectCreatorImpactManagementParticipation,
            )}
            update={(_, value) => setImpactManagementEnabled(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Fieldset>
          <SimpleString>
            <Content value={x => x.components.projectCreator.placeholderProjectCreatorProjectDuration} />
          </SimpleString>
          <ProjectCreatorForm.Date
            name="projectCreatorStartDate"
            value={() => startDate}
            placeholder={getContent(x => x.components.projectCreator.placeholderProjectCreatorProjectDuration)}
            update={(_, value) => setStartDate(value)}
          />
        </ProjectCreatorForm.Fieldset>
        <ProjectCreatorForm.Submit>Create project</ProjectCreatorForm.Submit>
      </ProjectCreatorForm.Form>
    </Section>
  );
};

/**
 * A development user switching interface, hidden behind an info-box.
 */
const HiddenProjectCreator = () => {
  const { getContent } = useContent();
  return (
    <Info summary={getContent(x => x.components.projectCreator.sectionTitle)}>
      <ProjectCreator />
    </Info>
  );
};

export { ProjectCreator, HiddenProjectCreator };
