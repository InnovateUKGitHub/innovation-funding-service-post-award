import { buildApex } from "project-factory";
import { makeBaseProject } from "../../helpers/baseProject";

interface ProjectFactoryData {
  prefix: string;
  project: {
    number: string;
  };
  pcl: {
    role: string;
    username: string;
    participantName: string;
  }[];
}

const createProject = (override?: (x: ReturnType<typeof makeBaseProject>) => void) => {
  const data = makeBaseProject();
  override?.(data);

  const prefix = Math.floor(Date.now() / 1000).toString() + ".";
  const apex = buildApex({
    instances: Object.values(data),
    options: {
      prefix,
    },
  });

  const projectData: ProjectFactoryData = {
    prefix,
    project: {
      number: prefix + data.project.getField("Acc_ProjectNumber__c"),
    },
    pcl: [
      {
        role: data.fcPcl.getField("Acc_Role__c"),
        username: prefix + data.fcUser.getField("Username"),
        participantName: data.fcPcl.getRelationship("Acc_AccountId__c")!.getField("Name") as string,
      },
      {
        role: data.pmPcl.getField("Acc_Role__c"),
        username: prefix + data.pmUser.getField("Username"),
        participantName: data.pmPcl.getRelationship("Acc_AccountId__c")!.getField("Name") as string,
      },
      {
        role: data.mspPcl.getField("Acc_Role__c"),
        username: prefix + data.mspUser.getField("Username"),
        participantName: data.mspPcl.getRelationship("Acc_AccountId__c")!.getField("Name") as string,
      },
    ],
  };

  cy.accTask("runApex", { apex });
  cy.accTask("setCyCache", {
    key: "projectFactory",
    value: JSON.stringify(projectData),
  });
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
