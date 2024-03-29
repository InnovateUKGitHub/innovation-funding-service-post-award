import { PermissionGroupIdentifier } from "@framework/constants/enums";
import { SalesforcePermissionGroupMapper } from "@server/repositories/mappers/permissionGroupMapper";

describe("SalesforcePermissionGroupMapper", () => {
  it("Maps id correctly", () => {
    const expectedId = "EXPECTED_ID";
    const mapper = new SalesforcePermissionGroupMapper({});
    const result = mapper.map({ Id: expectedId, DeveloperName: "" });

    expect(result.id).toEqual(expectedId);
  });

  it("Maps identifier if found correctly", () => {
    const lookup = {
      Expected_Developer_Name: PermissionGroupIdentifier.ClaimsTeam,
    };

    const mapper = new SalesforcePermissionGroupMapper(lookup);
    const result = mapper.map({ Id: "", DeveloperName: "Expected_Developer_Name" });

    expect(result.identifier).toEqual(PermissionGroupIdentifier.ClaimsTeam);
    expect(result.name).toEqual(PermissionGroupIdentifier[PermissionGroupIdentifier.ClaimsTeam]);
  });

  it("Maps identifier to unknown if not found", () => {
    const lookup = {
      Expected_Developer_Name: PermissionGroupIdentifier.ClaimsTeam,
    };

    const mapper = new SalesforcePermissionGroupMapper(lookup);
    const result = mapper.map({ Id: "", DeveloperName: "---Expected_Developer_Name---" });

    expect(result.identifier).toEqual(PermissionGroupIdentifier.Unknown);
    expect(result.name).toEqual(PermissionGroupIdentifier[PermissionGroupIdentifier.Unknown]);
  });
});
