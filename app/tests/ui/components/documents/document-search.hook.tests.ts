import { renderHook, act } from "@testing-library/react-hooks";

import * as hooksModule from "@ui/hooks";
import { hookTestBed, TestBedStore, TestBedContent } from "@shared/TestBed";
import { useDocumentSearch } from "@ui/components/documents/document-search.hook";
import { DocumentsBase } from "@ui/components/documents/documents.interface";

describe("useDocumentSearch()", () => {
  const stubTestContent = {
    test1: { content: "stub-test1" },
    test2: { content: "stub-test2" },
  };

  const setup = (disableSearch: boolean, originalDocuments: DocumentsBase["documents"], stubStore?: TestBedStore) =>
    renderHook(
      () => useDocumentSearch(disableSearch, originalDocuments),
      hookTestBed({ stores: stubStore, content: stubTestContent as TestBedContent }),
    );

  const stubBaseDocument: DocumentsBase["documents"][0] = {
    fileName: "stub-filename",
    link: "stub-link",
    id: "stub-id",
    fileSize: 1024,
    dateCreated: new Date(Date.UTC(2021, 10, 1)),
    uploadedBy: "stub-uploadedBy",
    isOwner: true
  };

  const isClientSpy = jest.spyOn(hooksModule, "useIsClient");

  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    describe("with isSearchable", () => {
      it("with non-js", () => {
        isClientSpy.mockReturnValue(false);

        const { result } = setup(false, []);

        expect(result.current.isSearchable).toBeFalsy();
      });

      describe("with document threshold", () => {
        it("when document length is below threshold", () => {
          isClientSpy.mockReturnValue(true);

          const stubStores = {
            config: {
              getConfig: () => ({
                features: {
                  searchDocsMinThreshold: 1,
                },
              }),
            },
          } as TestBedStore;
          const { result } = setup(false, [], stubStores);

          expect(result.current.isSearchable).toBeFalsy();
        });

        it("when document length equals threshold", () => {
          isClientSpy.mockReturnValue(true);

          const stubStores = {
            config: {
              getConfig: () => ({
                features: {
                  searchDocsMinThreshold: 1,
                },
              }),
            },
          } as TestBedStore;
          const { result } = setup(false, [stubBaseDocument], stubStores);

          expect(result.current.isSearchable).toBeTruthy();
        });

        it("when document length is above threshold", () => {
          isClientSpy.mockReturnValue(true);

          const stubStores = {
            config: {
              getConfig: () => ({
                features: {
                  searchDocsMinThreshold: 1,
                },
              }),
            },
          } as TestBedStore;
          const { result } = setup(false, [stubBaseDocument, stubBaseDocument], stubStores);

          expect(result.current.isSearchable).toBeTruthy();
        });
      });
    });

    describe("with hasDocuments", () => {
      it("when empty", () => {
        isClientSpy.mockReturnValue(true);
        const { result } = setup(false, []);

        expect(result.current.hasDocuments).toBeFalsy();
      });

      it("when populated", () => {
        isClientSpy.mockReturnValue(true);
        const { result } = setup(false, [stubBaseDocument]);

        expect(result.current.hasDocuments).toBeTruthy();
      });

      it("when populated matches filter results", () => {
        isClientSpy.mockReturnValue(true);
        const stubDocument = { ...stubBaseDocument };

        const { result } = setup(false, [stubDocument]);

        act(() => result.current.setFilterText(stubDocument.fileName));

        expect(result.current.hasDocuments).toBeTruthy();
      });

      it("when populated but does not match filter results", () => {
        isClientSpy.mockReturnValue(true);
        const stubDocument = { ...stubBaseDocument };
        const { result } = setup(false, [stubDocument]);

        act(() => result.current.setFilterText("I_WILL_NEVER_MATCH"));

        expect(result.current.hasDocuments).toBeFalsy();
      });
    });

    describe("with documents", () => {
      it("when empty", () => {
        isClientSpy.mockReturnValue(true);
        const { result } = setup(false, []);

        expect(result.current.documents).toHaveLength(0);
      });

      it("when populated", () => {
        isClientSpy.mockReturnValue(true);
        const { result } = setup(false, [stubBaseDocument]);

        expect(result.current.documents).toHaveLength(1);
      });
    });

    describe("with setFilterText", () => {
      describe("when disableSearch is false", () => {
        it("with a single document", () => {
          isClientSpy.mockReturnValue(true);
          const stubDocument = { ...stubBaseDocument };

          const { result } = setup(false, [stubDocument]);

          act(() => result.current.setFilterText(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(1);
        });

        it("with multiple documents", () => {
          isClientSpy.mockReturnValue(true);
          const stubDocument = { ...stubBaseDocument };

          const { result } = setup(false, [stubDocument, stubDocument]);

          act(() => result.current.setFilterText(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(2);
        });
      });

      describe("when populated matches filter results", () => {
        describe("when an obvious value will never match", () => {
          test.each`
            name                      | queryString
            ${"with a symbol"}        | ${"*"}
            ${"with a question mark"} | ${"?"}
            ${"with an open bracket"} | ${"("}
            ${"with a pound sign"}    | ${"£"}
          `("$name", ({ queryString }) => {
            isClientSpy.mockReturnValue(true);
            const stubDocument = { ...stubBaseDocument };

            const { result } = setup(false, [stubDocument]);

            act(() => result.current.setFilterText(queryString));

            expect(result.current.documents).toHaveLength(0);
          });
        });

        describe("when casing is ignored", () => {
          test.each`
            name                                                 | documentFileName       | queryCaseString
            ${"with first case uppercase"}                       | ${"Zephyr"}            | ${"zephyr"}
            ${"with mixed casing from query"}                    | ${"hello"}             | ${"hElLo"}
            ${"with mixed casing both filename and query value"} | ${"I sHoUld bE fOuNd"} | ${"fOunD"}
          `("$name", ({ documentFileName, queryCaseString }) => {
            isClientSpy.mockReturnValue(true);
            const stubDocument = { ...stubBaseDocument, fileName: documentFileName };

            const { result } = setup(false, [stubDocument]);

            act(() => result.current.setFilterText(queryCaseString));

            expect(result.current.documents).toHaveLength(1);
            expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
          });
        });

        it("when disableSearch is false all documents should return", () => {
          isClientSpy.mockReturnValue(true);
          const stubDocument = { ...stubBaseDocument };

          const nonMatchingDocument = {
            ...stubDocument,
            fileName: "nonMatchingDocument",
          };

          const { result } = setup(true, [stubDocument, nonMatchingDocument]);

          act(() => result.current.setFilterText(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(2);
          expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
          expect(result.current.documents[1].fileName).toBe(nonMatchingDocument.fileName);
        });

        it("with single result", () => {
          isClientSpy.mockReturnValue(true);
          const stubDocument = { ...stubBaseDocument };

          const nonMatchingDocument = {
            ...stubDocument,
            fileName: "nonMatchingDocument",
          };

          const { result } = setup(false, [stubDocument, nonMatchingDocument]);

          act(() => result.current.setFilterText(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(1);
          expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
        });

        it("with multiple results", () => {
          isClientSpy.mockReturnValue(true);
          const stubDocument = { ...stubBaseDocument };

          const nonMatchingDocument = {
            ...stubDocument,
            fileName: "nonMatchingDocument",
          };

          const { result } = setup(false, [stubDocument, stubDocument, nonMatchingDocument]);

          const searchValue = stubDocument.fileName.slice(0, 5);

          act(() => result.current.setFilterText(searchValue));

          expect(result.current.documents).toHaveLength(2);
          expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
          expect(result.current.documents[1].fileName).toBe(stubDocument.fileName);

          // Negative check - we should not have the non matching doc
          const queryNonMatchingDoc = result.current.documents.find(x => x.fileName === nonMatchingDocument.fileName);

          expect(queryNonMatchingDoc).toBeUndefined();
        });
      });
    });
  });
});
