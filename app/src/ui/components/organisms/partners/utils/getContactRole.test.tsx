import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectContactDto, ProjectRoleName } from "@framework/dtos/projectContactDto";
import { getContactRole } from "./getContactRole";

const steelManufacturingPartner = {
  id: "123",
  isLead: true,
  projectId: "456",
  accountId: "321",
  name: "Steel Manufacturing",
};
const universityOfLifePartner = {
  id: "912",
  isLead: false,
  projectId: "456",
  accountId: "312",
  name: "University of Life",
};
const driverlessCarsPartner = {
  id: "431",
  isLead: false,
  projectId: "456",
  accountId: "832",
  name: "Driverless Cars",
};
const partners: PartnerDto[] = [
  steelManufacturingPartner,
  universityOfLifePartner,
  driverlessCarsPartner,
] as PartnerDto[];

const tedTesterContact = {
  id: "100",
  name: "Ted Tester",
  role: "Finance contact",
  roleName: "Finance Contact",
  email: "tedtester@nowhere.com",
  accountId: "321",
  projectId: "456",
};
const daveDeveloperContact = {
  id: "101",
  name: "Dave Developer",
  role: "Project Manager",
  roleName: "Project Manager",
  email: "davedeveloper@nowhere.com",
  accountId: "312",
  projectId: "456",
};
const joeBloggsContact = {
  id: "102",
  name: "Joe Bloggs",
  role: "Finance contact",
  roleName: "Finance Contact",
  email: "joebloggs@nowhere.com",
  accountId: "312",
  projectId: "456",
};
const bobBakerContact = {
  id: "103",
  name: "Bob Baker",
  role: "Finance contact",
  roleName: "Finance Contact",
  email: "bobbaker@nowhere.com",
  accountId: "832",
  projectId: "456",
};
const neilLittleContact = {
  id: "104",
  name: "Neil Little",
  role: "Monitoring officer",
  roleName: "Monitoring Officer",
  email: "neil.little@iuk.ukri.org",
  accountId: "832",
  projectId: "456",
};
const nicoleHedgesContact = {
  id: "105",
  name: "Nicole Hedges",
  role: "Finance contact",
  roleName: "Finance Contact",
  email: "bobbaker@nowhere.com",
  accountId: "832",
  projectId: "456",
};

const contacts: ProjectContactDto[] = [
  tedTesterContact,
  daveDeveloperContact,
  joeBloggsContact,
  bobBakerContact,
  neilLittleContact,
  nicoleHedgesContact,
] as ProjectContactDto[];

describe("getContactRole", () => {
  const moRoles = getContactRole({ contacts, partners, partnerRole: ProjectRoleName.MonitoringOfficer });
  const pmRoles = getContactRole({ contacts, partners, partnerRole: ProjectRoleName.ProjectManager });
  const fcRoles = getContactRole({ contacts, partners, partnerRole: ProjectRoleName.FinanceContact });

  it("gets all MOs of a project", () => {
    expect(moRoles).toStrictEqual([
      {
        partner: driverlessCarsPartner,
        contact: neilLittleContact,
      },
    ]);
  });

  it("gets all PMs of a project", () => {
    expect(pmRoles).toStrictEqual([
      {
        partner: universityOfLifePartner,
        contact: daveDeveloperContact,
      },
    ]);
  });

  it("gets all FCs of a project", () => {
    expect(fcRoles).toStrictEqual([
      {
        partner: driverlessCarsPartner,
        contact: bobBakerContact,
      },
      {
        partner: driverlessCarsPartner,
        contact: nicoleHedgesContact,
      },
      {
        partner: steelManufacturingPartner,
        contact: tedTesterContact,
      },
      {
        partner: universityOfLifePartner,
        contact: joeBloggsContact,
      },
    ]);
  });
});
