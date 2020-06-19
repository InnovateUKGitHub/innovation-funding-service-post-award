// tslint:disable:no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import {
  PCRContactRole,
  PCRItemForPartnerAdditionDto,
  PCRItemType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
} from "@framework/types";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemStatus, PCROrganisationType, PCRStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";

// tslint:disable-next-line:no-big-function
describe("UpdatePCRCommand - Partner addition", () => {
  const setup = () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
    const recordTypes = context.testData.createPCRRecordTypes();
    const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerAddition)!;
    const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
    return {context, recordType, projectChangeRequest, project};
  };
  it("should require project role and partner type to be set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.projectRole = PCRProjectRole.Unknown;
    item.partnerType = PCRPartnerType.Unknown;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("should require project role and partner type to be set if the flag is set to required", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.projectRole = PCRProjectRole.Unknown;
    item.partnerType = PCRPartnerType.Unknown;
    item.isProjectRoleAndPartnerTypeRequired = true;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("should require organisation name to be set when the organisation type is Academic", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Research,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Academic,
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      financialYearEndTurnover: 33,
      financialYearEndDate: new Date(),
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      participantSize: PCRParticipantSize.Medium,
      numberOfEmployees: 15,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.organisationName = "Coventry University";
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require company house details to be set when the organisation type is Industrial", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Business,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Industrial,
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      financialYearEndTurnover: 33,
      financialYearEndDate: new Date(),
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      participantSize: PCRParticipantSize.Medium,
      numberOfEmployees: 15,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.organisationName = "Business name";
    item.registrationNumber = "12345";
    item.registeredAddress = "1 Bristol Street, Bristol";
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require finance contact details to be set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Research,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Academic,
      organisationName: "Coventry University",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      participantSize: PCRParticipantSize.Medium,
      numberOfEmployees: 15,
      financialYearEndDate: new Date(),
      financialYearEndTurnover: 20,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1ProjectRole = PCRContactRole.FinanceContact;
    item.contact1Forename = "Homer";
    item.contact1Surname = "Of Iliad fame";
    item.contact1Phone = "112233";
    item.contact1Email = "helen@troy.com";
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require organisation details to be set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Research,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Academic,
      organisationName: "Coventry University",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      financialYearEndTurnover: 20,
      financialYearEndDate: new Date(),
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.participantSize = PCRParticipantSize.Medium;
    item.numberOfEmployees = 15;
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require financial details to be set when the organisaiton type is Industrial", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Business,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Industrial,
      organisationName: "Coventry University",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      registeredAddress: "Landaaan",
      registrationNumber: "1234",
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      participantSize: PCRParticipantSize.Large,
      numberOfEmployees: 150,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.financialYearEndDate = new Date();
    item.financialYearEndTurnover = 20;
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should not require financial details to be set when the organisation type is Academic", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Research,
      projectRole: PCRProjectRole.Collaborator,
      organisationType: PCROrganisationType.Academic,
      organisationName: "Coventry University",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      participantSize: PCRParticipantSize.Large,
      numberOfEmployees: 150,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require project manager details to be set when the project role is Project Lead", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Business,
      projectRole: PCRProjectRole.ProjectLead,
      organisationName: "Coventry business",
      registrationNumber: "123345",
      registeredAddress: "Coventry Street",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Coventry",
      financialYearEndTurnover: 33,
      financialYearEndDate: new Date(),
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      participantSize: PCRParticipantSize.Medium,
      numberOfEmployees: 15,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact2Forename = "Jon";
    item.contact2Surname = "Doe";
    item.contact2Phone = "332211";
    item.contact2Email = "e@mail.com";
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should require project location to be set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      partnerType: PCRPartnerType.Business,
      projectRole: PCRProjectRole.ProjectLead,
      organisationName: "Coventry business",
      registrationNumber: "123345",
      registeredAddress: "Coventry Street",
      projectCity: "Coventry",
      financialYearEndTurnover: 33,
      financialYearEndDate: new Date(),
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Homer",
      contact1Surname: "Of Iliad fame",
      contact1Phone: "112233",
      contact1Email: "helen@troy.com",
      contact2Forename: "Jon",
      contact2Surname: "Doe",
      contact2Phone: "332211",
      contact2Email: "e@mail.com",
      participantSize: PCRParticipantSize.Medium,
      numberOfEmployees: 15,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.projectLocation = PCRProjectLocation.InsideTheUnitedKingdom;
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should not allow updates to project role & partner type fields once they are set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Research });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.projectRole = PCRProjectRole.ProjectLead;
    await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    item.projectRole = PCRProjectRole.Collaborator;
    item.partnerType = PCRPartnerType.ResearchAndTechnology;
    await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
  });
  it("should update item status", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      projectRole: PCRProjectRole.Collaborator,
      partnerType: PCRPartnerType.Business,
      organisationName: "Coventry business",
      registrationNumber: "123345",
      registeredAddress: "Coventry Street",
      projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
      projectCity: "Bristol",
      projectPostcode: "BS1 5UW",
      financialYearEndTurnover: 20,
      financialYearEndDate: new Date(),
      contact1ProjectRole: PCRContactRole.FinanceContact,
      contact1Forename: "Marjorie",
      contact1Surname: "Evans",
      contact1Phone: "020000111",
      contact1Email: "marj@evans.com",
      participantSize: PCRParticipantSize.Large,
      numberOfEmployees: 150,
    });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    await expect(await context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).toBe(true);
    const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const updatedItem = updated.items[0] as PCRItemForPartnerAdditionDto;
    expect(updatedItem.status).toEqual(PCRItemStatus.Complete);
  });
  it("should update the relevant fields", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    const financialYearEndDate = new Date();
    item.contact1ProjectRole = PCRContactRole.FinanceContact;
    item.contact1Forename = "Marjorie";
    item.contact1Surname = "Evans";
    item.contact1Phone = "020000111";
    item.contact1Email = "marj@evans.com";
    item.financialYearEndDate = financialYearEndDate;
    item.financialYearEndTurnover = 45;
    item.organisationName = "Bristol University";
    item.registeredAddress = "1 Bristol Street, Bristol";
    item.registrationNumber = "11223344";
    item.projectRole = PCRProjectRole.ProjectLead;
    item.partnerType = PCRPartnerType.Other;
    item.projectLocation = PCRProjectLocation.InsideTheUnitedKingdom;
    item.projectCity = "Bristol";
    item.projectPostcode = "BS1 5UW";
    item.participantSize = PCRParticipantSize.Medium;
    item.numberOfEmployees = 0;
    item.contact2ProjectRole = PCRContactRole.ProjectManager;
    item.contact2Forename = "Jon";
    item.contact2Surname = "Doe";
    item.contact2Phone = "18005552368";
    item.contact2Email = "jon@doe.com";

    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(await context.runCommand(command)).toBe(true);
    const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const updatedItem = updated.items[0] as PCRItemForPartnerAdditionDto;
    expect(updatedItem.contact1ProjectRole).toEqual(PCRContactRole.FinanceContact);
    expect(updatedItem.contact1Forename).toEqual("Marjorie");
    expect(updatedItem.contact1Surname).toEqual("Evans");
    expect(updatedItem.contact1Phone).toEqual("020000111");
    expect(updatedItem.contact1Email).toEqual("marj@evans.com");
    expect(updatedItem.financialYearEndDate).toEqual(financialYearEndDate);
    expect(updatedItem.financialYearEndTurnover).toEqual(45);
    expect(updatedItem.organisationName).toEqual("Bristol University");
    expect(updatedItem.registeredAddress).toEqual("1 Bristol Street, Bristol");
    expect(updatedItem.registrationNumber).toEqual("11223344");
    expect(updatedItem.projectRole).toEqual(PCRProjectRole.ProjectLead);
    expect(updatedItem.partnerType).toEqual(PCRPartnerType.Other);
    expect(updatedItem.projectLocation).toEqual(PCRProjectLocation.InsideTheUnitedKingdom);
    expect(updatedItem.projectCity).toEqual("Bristol");
    expect(updatedItem.projectPostcode).toEqual("BS1 5UW");
    expect(updatedItem.participantSize).toEqual(PCRParticipantSize.Medium);
    expect(updatedItem.numberOfEmployees).toEqual(0);
    expect(updatedItem.contact2ProjectRole).toEqual(PCRContactRole.ProjectManager);
    expect(updatedItem.contact2Forename).toEqual("Jon");
    expect(updatedItem.contact2Surname).toEqual("Doe");
    expect(updatedItem.contact2Phone).toEqual("18005552368");
    expect(updatedItem.contact2Email).toEqual("jon@doe.com");
  });
  describe("Spend Profile", () => {
    it("should update pcr spend profiles", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.spendProfile.costs.push({
        id: "",
        value: 60,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        ratePerDay: 20,
        daysSpentOnProject: 10,
        description: "Queen",
        grossCostOfRole: 200
      });
      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(insertedSpendProfileCost.daysSpentOnProject! * insertedSpendProfileCost.ratePerDay!);
      expect(insertedSpendProfileCost.costCategoryId).toBe(costCategoryLabour.id);
      expect(insertedSpendProfileCost.pcrItemId).toBe(item.id);
      expect(insertedSpendProfileCost.grossCostOfRole).toBe(200);
      expect(insertedSpendProfileCost.daysSpentOnProject).toBe(10);
      expect(insertedSpendProfileCost.ratePerDay).toBe(20);
      expect(insertedSpendProfileCost.description).toBe("Queen");
    });
  });
});
