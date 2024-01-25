import { PCRStatus, PCRItemType, recordTypeMetaValues } from "@framework/constants/pcrConstants";
import { TestContext } from "./testContextProvider";

export const setup = (projectStatus?: string) => {
  const context = new TestContext();

  const project = context.testData.createProject(
    projectStatus ? x => (x.Acc_ProjectStatus__c = projectStatus) : undefined,
  );

  context.testData.createCurrentUserAsProjectManager(project);
  const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.DraftWithProjectManager });
  const recordTypes = context.testData.createPCRRecordTypes();
  const projectSuspensionType = recordTypeMetaValues.find(x => x.type === PCRItemType.PartnerAddition);
  const recordType = recordTypes.find(x => x.type === projectSuspensionType?.typeName);
  return { context, recordType, projectChangeRequest, project };
};
