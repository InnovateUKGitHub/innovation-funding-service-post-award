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
import { CostCategoryType, ProjectChangeRequestItemEntity } from "@framework/entities";
import { DateTime } from "luxon";

const createCompleteIndustrialPcrItem: () => Partial<ProjectChangeRequestItemEntity> = () => ({
  status: PCRItemStatus.Incomplete,
  partnerType: PCRPartnerType.Business,
  projectRole: PCRProjectRole.ProjectLead,
  isCommercialWork: true,
  organisationType: PCROrganisationType.Industrial,
  projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
  projectCity: "Coventry",
  projectPostcode: "CV1 5FB",
  financialYearEndTurnover: 33,
  financialYearEndDate: new Date(),
  contact1ProjectRole: PCRContactRole.FinanceContact,
  contact1Forename: "Homer",
  contact1Surname: "Of Iliad fame",
  contact1Phone: "112233",
  contact1Email: "helen@troy.com",
  participantSize: PCRParticipantSize.Medium,
  numberOfEmployees: 15,
  organisationName: "Coventry University",
  registrationNumber: "3333",
  registeredAddress: "1 Victoria Street",
  awardRate: 39,
  hasOtherFunding: true,
  contact2Forename: "Jon",
  contact2Surname: "Doe",
  contact2Phone: "332211",
  contact2Email: "e@mail.com",
});

const createCompleteAcademicPcrItem: () => Partial<ProjectChangeRequestItemEntity> = () => ({
  status: PCRItemStatus.Incomplete,
  partnerType: PCRPartnerType.Research,
  projectRole: PCRProjectRole.Collaborator,
  isCommercialWork: true,
  organisationType: PCROrganisationType.Academic,
  projectLocation: PCRProjectLocation.InsideTheUnitedKingdom,
  projectCity: "Coventry",
  projectPostcode: "CV1 5FB",
  contact1ProjectRole: PCRContactRole.FinanceContact,
  contact1Forename: "Homer",
  contact1Surname: "Of Iliad fame",
  contact1Phone: "112233",
  contact1Email: "helen@troy.com",
  participantSize: PCRParticipantSize.Medium,
  numberOfEmployees: 15,
  organisationName: "Coventry University",
  awardRate: 39,
  hasOtherFunding: true,
  tsbReference: "12345ABCDE",
});

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
  it("should require project role and partner type to be set on complete", async () => {
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
    let dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    let item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.projectRole = PCRProjectRole.Unknown;
    item.partnerType = PCRPartnerType.Unknown;
    item.isProjectRoleAndPartnerTypeRequired = true;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    // get fresh dto to test commercial work
    dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.isProjectRoleAndPartnerTypeRequired = true;
    item.isCommercialWork = null;
    await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

  });
  it("should require fields to be set when the organisation type is Academic", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    const completeItem = createCompleteAcademicPcrItem();
    context.testData.createPCRItem(projectChangeRequest, recordType, completeItem);
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);

    delete item.organisationName;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.organisationName = "Coventry University";
    await expect(context.runCommand(command)).resolves.toBe(true);
    delete item.tsbReference;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.tsbReference = "12345ABCDE";
    await expect(context.runCommand(command)).resolves.toBe(true);
  });

  it("should require fields to be set when the organisation type is Industrial", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    const completeItem = createCompleteIndustrialPcrItem();
    context.testData.createPCRItem(projectChangeRequest, recordType, completeItem);
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);

    delete item.organisationName;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.organisationName = "Coventry University";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.registrationNumber;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.registrationNumber = "12345";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.registeredAddress;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.registeredAddress = "1 Bristol Street, Bristol";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact1ProjectRole;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1ProjectRole = PCRContactRole.FinanceContact;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact1Forename;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1Forename = "Homer";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact1Surname;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1Surname = "Of Iliad fame";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact1Phone;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1Phone = "112233";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact1Email;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact1Email = "helen@troy.com";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.participantSize;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.participantSize = PCRParticipantSize.Medium;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.numberOfEmployees;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.numberOfEmployees = 5;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.financialYearEndDate;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.financialYearEndDate = new Date();
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.financialYearEndTurnover;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.financialYearEndTurnover = 20;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact2Forename;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact2Forename = "Jon";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact2Surname;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact2Surname = "Doe";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact2Phone;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact2Phone = "12309833";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.contact2Email;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.contact2Email = "12309833@blah.com";
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.projectLocation;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.projectLocation = PCRProjectLocation.InsideTheUnitedKingdom;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.awardRate;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.awardRate = 12;
    await expect(context.runCommand(command)).resolves.toBe(true);

    delete item.hasOtherFunding;
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    item.hasOtherFunding = false;
    await expect(context.runCommand(command)).resolves.toBe(true);
  });
  it("should not allow updates to project role & partner type fields once they are set", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Research, isCommercialWork: false });
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
    context.testData.createPCRItem(projectChangeRequest, recordType, createCompleteIndustrialPcrItem());
    const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
    const item = dto.items[0] as PCRItemForPartnerAdditionDto;
    item.status = PCRItemStatus.Complete;
    await context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto));
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
    item.awardRate = 62;
    item.hasOtherFunding = true;
    item.totalOtherFunding = null;
    item.isCommercialWork = true;
    item.tsbReference = "54321EDCBA";

    const costCategoryOtherFunding = context.testData.createCostCategory({name: "Other Funding", type: CostCategoryType.Other_Funding});
    const dummyDate = DateTime.local().toJSDate();
    item.spendProfile.funds = [
      {
        id: "",
        costCategory: CostCategoryType.Other_Funding,
        costCategoryId: costCategoryOtherFunding.id,
        value: 101.02,
        description: "Moo lah",
        dateSecured: dummyDate,
      },
      {
        id: "",
        costCategory: CostCategoryType.Other_Funding,
        costCategoryId: costCategoryOtherFunding.id,
        value: 120.99,
        description: "Dosh",
        dateSecured: dummyDate,
      }
    ];

    const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
    await context.runCommand(command);
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
    expect(updatedItem.awardRate).toEqual(62);
    expect(updatedItem.hasOtherFunding).toEqual(true);
    expect(updatedItem.totalOtherFunding).toEqual(101.02 + 120.99);
    expect(updatedItem.isCommercialWork).toEqual(true);
    expect(updatedItem.tsbReference).toEqual("54321EDCBA");
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
      await context.runCommand(command);
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
