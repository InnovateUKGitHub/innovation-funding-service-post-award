import { ExecuteApprovalProcessScript } from "@innovateuk/project-factory-two/scripts/ExecuteApprovalProcessScript";
import { Acc_Claims__c } from "@innovateuk/project-factory-two/sobjects/Acc_Claims__c";
import { Acc_Prepayment__c } from "@innovateuk/project-factory-two/sobjects/Acc_Prepayment__c";
import { SObjectFieldIdType } from "@innovateuk/project-factory-two/types/SObjectFieldType";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { AbstractProjectFactoryApexScript } from "./AbstractProjectFactoryApexScript";

export
@Fixture("sfdcExecuteApprovalProcessScript")
class SfdcExecuteApprovalProcessScript extends AbstractProjectFactoryApexScript<{ id: SObjectFieldIdType }> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new ExecuteApprovalProcessScript({ connection });
  }

  @Given("the system user approves the {string} claim")
  public approveClaim(claimKey: string) {
    const claim = this.projectState.context[claimKey];
    if (!(claim instanceof Acc_Claims__c)) throw new Error("Claim key is not of type Acc_Claims__c");
    return this.createProject({ id: claim.Id });
  }

  @Given("the grant adjustment {string} is approved by the system user")
  public approveGrantAdjustment(adjustment: string) {
    const grantAdjustment = this.projectState.context[adjustment];
    if (!(grantAdjustment instanceof Acc_Prepayment__c))
      throw new Error("Grant Adjustment key is not of type Acc_Prepayment__c");
    return this.createProject({ id: grantAdjustment.Id });
  }
}
