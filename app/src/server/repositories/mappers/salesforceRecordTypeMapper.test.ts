import { SalesforceRecordTypeMapper } from "@server/repositories/mappers/recordTypeMapper";
import { ISalesforceRecordType } from "../recordTypeRepository";
import { ProjectChangeRequest } from "@framework/constants/recordTypes";
describe("SalesforceRecordTypeMapper", () => {
  const createSalesforceItem = (item: Partial<ISalesforceRecordType>): ISalesforceRecordType => {
    const defaultItem: ISalesforceRecordType = {
      Id: "Test Id",
      Name: "Test Name",
      SobjectType: "Test Object Type",
      DeveloperName: ProjectChangeRequest.singlePartnerFinancialVirement,
    };

    return Object.assign(defaultItem, item);
  };

  it("Maps id correctly", () => {
    const expectedId = "EXPECTED_ID";
    const mapper = new SalesforceRecordTypeMapper();
    const result = mapper.map(createSalesforceItem({ Id: expectedId }));

    expect(result.id).toEqual(expectedId);
  });

  it("Maps type correctly", () => {
    const expectedType = "EXPECTED_TYPE";
    const mapper = new SalesforceRecordTypeMapper();
    const result = mapper.map(createSalesforceItem({ Name: expectedType }));

    expect(result.type).toEqual(expectedType);
  });

  it("Maps parent correctly", () => {
    const expectedParent = "EXPECTED_PARENT";
    const mapper = new SalesforceRecordTypeMapper();
    const result = mapper.map(createSalesforceItem({ SobjectType: expectedParent }));

    expect(result.parent).toEqual(expectedParent);
  });

  it("Maps DeveloperName correctly", () => {
    const expectedDeveloperName = "EXPECTED_DEVELOPER_NAME";
    const mapper = new SalesforceRecordTypeMapper();
    const result = mapper.map(createSalesforceItem({ DeveloperName: expectedDeveloperName }));

    expect(result.developerName).toEqual(expectedDeveloperName);
  });
});
