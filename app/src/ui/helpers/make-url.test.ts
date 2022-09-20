import { makeUrlWithQuery, getParamsFromUrl } from "./make-url";

describe("makeUrlWithQuery", () => {
  const params = {
    id: 123,
    projectId: "ktp3001",
    search: 456,
    name: "neil little",
    email: "neil.little@iuk.ukri.org",
    partnerId: "strfsYTF",
    periodId: 4,
  };

  it("should match properties in the url with matching params", () => {
    expect(makeUrlWithQuery("/projects/:projectId/claims/:partnerId/prepare/:periodId", params)).toEqual(
      "/projects/ktp3001/claims/strfsYTF/prepare/4",
    );
  });

  it("should match a query in the url with matching params", () => {
    expect(makeUrlWithQuery("/ukri/project?:search", params)).toEqual("/ukri/project?search=456");
  });

  it("should match properties and a query in the url", () => {
    expect(makeUrlWithQuery("/ukri/:id/project/:projectId?:search", params)).toEqual(
      "/ukri/123/project/ktp3001?search=456",
    );
  });

  it("should match multiple queries in the url", () => {
    expect(makeUrlWithQuery("/ukri/:id/project/:projectId?:name&:email", params)).toEqual(
      "/ukri/123/project/ktp3001?name=neil%20little&email=neil.little%40iuk.ukri.org",
    );
  });

  it("should return the url if no params passed in", () => {
    expect(makeUrlWithQuery("/ukri/id/project", {})).toEqual("/ukri/id/project");
  });
});

describe("getParams", () => {
  const routePath = "/projects/:projectId/claims/:partnerId/review/:periodId/costs/:costCategoryId/moId/:moId";
  const url = "/projects/12345678/claims/foo/review/4/costs/bar/moId/4ef12gh4";

  const defaultResponse = {
    projectId: 12345678,
    partnerId: "foo",
    periodId: 4,
    costCategoryId: "bar",
    moId: "4ef12gh4",
  };

  test.each`
    name                                                                                              | testUrl                      | search                                                 | expected
    ${"should convert to an object of params, converting to a number if possible"}                    | ${url}                       | ${""}                                                  | ${{ ...defaultResponse }}
    ${"should handle the existence of query strings appended to pathname by ignoring"}                | ${`${url}?foo=bar&baz=quux`} | ${""}                                                  | ${{ ...defaultResponse }}
    ${"should handle the existence of search query appended as extra arg by adding to params object"} | ${url}                       | ${"?foo=bar&baz=quux"}                                 | ${{ ...defaultResponse, foo: "bar", baz: "quux" }}
    ${"should not convert duplicate query params into an array, treating last instance as value"}     | ${url}                       | ${"?filters=1&filters=2&filters=three"}                | ${{ ...defaultResponse, filters: "three" }}
    ${"should not treat params ending in [] as an array"}                                             | ${url}                       | ${"?filters[]=1&filters[]=2&filters[]=three"}          | ${{ ...defaultResponse, "filters[]": "three" }}
    ${"should convert duplicate query params beginning with 'array' into an array of strings"}        | ${url}                       | ${"?arrayFilters=1&arrayFilters=2&arrayFilters=three"} | ${{ ...defaultResponse, arrayFilters: ["1", "2", "three"] }}
  `("$name", ({ testUrl, search, expected }) => {
    expect(getParamsFromUrl(routePath, testUrl, search).params).toEqual(expected);
  });
});
