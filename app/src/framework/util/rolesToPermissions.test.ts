import { convertRolesToPermissionsValue, Role } from "./rolesToPermissions";

describe("rolesToPermissions", () => {
  test.each`
    roles                                        | permissions
    ${{ isPm: false, isMo: false, isFc: false }} | ${0}
    ${{ isPm: false, isMo: true, isFc: false }}  | ${1}
    ${{ isPm: true, isMo: false, isFc: false }}  | ${2}
    ${{ isPm: false, isMo: false, isFc: true }}  | ${4}
    ${{ isPm: true, isMo: true, isFc: false }}   | ${3}
    ${{ isPm: false, isMo: true, isFc: true }}   | ${5}
    ${{ isPm: true, isMo: false, isFc: true }}   | ${6}
    ${{ isPm: true, isMo: true, isFc: true }}    | ${7}
  `(
    "it should return the matching permissions for the roles",
    ({ roles, permissions }: { roles: Role; permissions: number }) => {
      expect(convertRolesToPermissionsValue(roles)).toEqual(permissions);
    },
  );
});
