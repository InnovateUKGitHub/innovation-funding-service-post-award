import { accClaimTotalProjectPeriodBuilder } from "../factory/ifspa/Acc_Claims__c.Total_Project_Period";
import { accProfileDetailBuilder } from "../factory/ifspa/Acc_Profile__c.Profile_Detail";
import { accProfileTotalCostCategoryBuilder } from "../factory/ifspa/Acc_Profile__c.Total_Cost_Category";
import { accProjectBuilder } from "../factory/ifspa/Acc_Project__c";
import { accPcrRemovePartnerBuilder } from "../factory/ifspa/Acc_ProjectChangeRequest__c.RemovePartner";
import { accPcrHeaderBuilder } from "../factory/ifspa/Acc_ProjectChangeRequest__c.RequestHeader";
import { accProjectContactLinkBuilder } from "../factory/ifspa/Acc_ProjectContactLink__c";
import { accProjectParticipantBuilder } from "../factory/ifspa/Acc_ProjectParticipant__c";
import { accountBuilder } from "../factory/ifspa/Account";
import { competitionBuilder } from "../factory/ifspa/Competition__c";
import { contactBuilder } from "../factory/ifspa/Contact";
import { projectFactoryClaimsAndProfilesHelperBuilder } from "../factory/ifspa/ProjectFactory.ClaimsAndProfilesHelper";
import { userBuilder } from "../factory/ifspa/User";
import { ProjectFactoryInstanceType } from "./ProjectFactoryDefinition";

interface ProjectFactoryDto {
  project: ProjectFactoryInstanceType<typeof accProjectBuilder>;
  logins: {
    pcl: ProjectFactoryInstanceType<typeof accProjectContactLinkBuilder>;
    user: ProjectFactoryInstanceType<typeof userBuilder>;
    contact: ProjectFactoryInstanceType<typeof contactBuilder>;
    account: ProjectFactoryInstanceType<typeof accountBuilder>;
  }[];
  pcrs: {
    headers: ProjectFactoryInstanceType<typeof accPcrHeaderBuilder>[];
    removePartner: ProjectFactoryInstanceType<typeof accPcrRemovePartnerBuilder>[];
  };
  competition: ProjectFactoryInstanceType<typeof competitionBuilder>;
  projectParticipants: ProjectFactoryInstanceType<typeof accProjectParticipantBuilder>[];
  profiles: {
    projectFactoryHelpers: ProjectFactoryInstanceType<typeof projectFactoryClaimsAndProfilesHelperBuilder>[];
    details: ProjectFactoryInstanceType<typeof accProfileDetailBuilder>[];
    totalCostCategories: ProjectFactoryInstanceType<typeof accProfileTotalCostCategoryBuilder>[];
    claimTotalProjectPeriods: ProjectFactoryInstanceType<typeof accClaimTotalProjectPeriodBuilder>[];
  };
}

export { ProjectFactoryDto };
