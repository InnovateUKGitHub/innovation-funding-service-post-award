import { SalesforcePermissionGroupMapper } from "@server/repositories/mappers/permissionGroupMapper";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";

describe("SalesforcePermissionGroupMapper", () => {
  it("Maps id correctly", () => {
    const expectedId = "EXPECTED_ID";
    const mapper = new SalesforcePermissionGroupMapper({});
    const result = mapper.map({ Id: expectedId, DeveloperName: "" });

    expect(result.id).toEqual(expectedId);
  });

  it("Maps idenfier if found correctly", () => {

    const lookup = {
      Expected_Develoiper_Name: PermissionGroupIdenfifier.ClaimsTeam
    };

    const mapper = new SalesforcePermissionGroupMapper(lookup);
    const result = mapper.map({ Id: "", DeveloperName: "Expected_Develoiper_Name" });

    expect(result.identifier).toEqual(PermissionGroupIdenfifier.ClaimsTeam);
    expect(result.name).toEqual(PermissionGroupIdenfifier[PermissionGroupIdenfifier.ClaimsTeam]);
  });

  it("Maps idenfier to unknown if not found", () => {

    const lookup = {
      Expected_Develoiper_Name: PermissionGroupIdenfifier.ClaimsTeam
    };

    const mapper = new SalesforcePermissionGroupMapper(lookup);
    const result = mapper.map({ Id: "", DeveloperName: "---Expected_Develoiper_Name---" });

    expect(result.identifier).toEqual(PermissionGroupIdenfifier.Unknown);
    expect(result.name).toEqual(PermissionGroupIdenfifier[PermissionGroupIdenfifier.Unknown]);
  });
});
