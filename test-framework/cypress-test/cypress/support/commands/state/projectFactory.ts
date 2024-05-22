import { CreateProjectProps, buildApex } from "project-factory";

const createProject = (data: CreateProjectProps) => {
  const prefix = Math.floor(Date.now() / 1000).toString() + ".";
  const apex = buildApex({
    instances: [
      data.project,
      data.projectParticipant,
      ...data.pcrs.headers,
      ...data.pcrs.removePartner,
      ...data.logins.map(x => [x.account, x.contact, x.pcl, x.user]),
      data.competition,
    ].flat(),
    options: {
      prefix,
    },
  });

  const projectData: ProjectFactoryData = {
    prefix,
    project: {
      number: prefix + data.project.getField("Acc_ProjectNumber__c"),
      title: data.project.getField("Acc_ProjectTitle__c"),
    },
    pcl: data.logins.map(({ pcl, user }) => ({
      role: pcl.getField("Acc_Role__c"),
      username: prefix + user.getField("Username"),
      participantName: pcl.getRelationship("Acc_AccountId__c")!.getField("Name") as unknown as Readonly<string>,
    })),
  };

  cy.accTask("runApex", { apex });
  cy.accTask("setCyCache", {
    key: "projectFactory",
    value: JSON.stringify(projectData),
  });

  return cy.recallProject();
};

const recallProject = () => {
  return cy
    .accTask("getCyCache", { key: "projectFactory" })
    .then(x => (JSON.parse(x) ?? null) as ProjectFactoryData | null);
};

const projectFactoryCommands = {
  createProject,
  recallProject,
} as const;

export { projectFactoryCommands };
