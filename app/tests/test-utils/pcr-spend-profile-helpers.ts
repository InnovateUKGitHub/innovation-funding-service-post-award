import { PCRItemType, PCRStatus } from "@framework/constants";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { TestContext } from "./testContextProvider";

export const setup = (projectStatus?: string) => {
    const context = new TestContext();

    const project = context.testData.createProject(projectStatus ? x => x.Acc_ProjectStatus__c = projectStatus : undefined);

    context.testData.createCurrentUserAsProjectManager(project);
    const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
    const recordTypes = context.testData.createPCRRecordTypes();
    const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === PCRItemType.PartnerAddition);
    const recordType = recordTypes.find(x => x.type === projectSuspensionType?.typeName);
    return {context, recordType, projectChangeRequest, project};
};
