import { renderHook, act } from "@testing-library/react";
import { hookTestBed, HookTestBedProps } from "@shared/TestBed";
import { useDocumentSearch } from "@ui/components/organisms/documents/utils/document-search.hook";
import { DocumentsBase } from "@ui/components/organisms/documents/utils/documents.interface";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { generateId } from "@tests/test-utils/generateId";

describe("useDocumentSearch()", () => {
  const setup = (disableSearch: boolean, originalDocuments: DocumentsBase["documents"], options?: HookTestBedProps) =>
    renderHook(() => useDocumentSearch(disableSearch, originalDocuments), hookTestBed({ ...options }));

  const stubBaseDocument: DocumentsBase["documents"][0] = {
    fileName: "stub-filename",
    link: "stub-link",
    id: generateId("DocumentId"),
    fileSize: 1024,
    dateCreated: new Date(Date.UTC(2021, 10, 1)),
    uploadedBy: "stub-uploadedBy",
    isOwner: true,
  };

  describe("@returns", () => {
    describe("with isSearchable", () => {
      it("with non-js", () => {
        const { result } = setup(false, [], { isServer: true });

        expect(result.current.displaySearch).toBeFalsy();
      });

      describe("with document threshold", () => {
        it.each`
          name       | documents                               | shown
          ${"below"} | ${[]}                                   | ${false}
          ${"equal"} | ${[stubBaseDocument]}                   | ${true}
          ${"above"} | ${[stubBaseDocument, stubBaseDocument]} | ${true}
        `(
          "when document length is $name threshold",
          ({ documents, shown }: { documents: DocumentSummaryDto[]; shown: boolean }) => {
            const { result } = setup(false, documents, {
              extendClientConfig(config) {
                config.features.searchDocsMinThreshold = 1;
              },
            });

            expect(result.current.displaySearch).toEqual(shown);
          },
        );
      });
    });

    describe("with hasDocuments", () => {
      it("when empty", () => {
        const { result } = setup(false, []);

        expect(result.current.hasDocuments).toBeFalsy();
      });

      it("when populated", () => {
        const { result } = setup(false, [stubBaseDocument]);

        expect(result.current.hasDocuments).toBeTruthy();
      });

      it("when populated matches filter results", () => {
        const stubDocument = { ...stubBaseDocument };

        const { result } = setup(false, [stubDocument]);

        act(() => result.current.filterConfig.onSearch(stubDocument.fileName));

        expect(result.current.hasDocuments).toBeTruthy();
      });

      it("when populated but does not match filter results", () => {
        const stubDocument = { ...stubBaseDocument };
        const { result } = setup(false, [stubDocument]);

        act(() => result.current.filterConfig.onSearch("I_WILL_NEVER_MATCH"));

        expect(result.current.hasDocuments).toBeFalsy();
      });
    });

    describe("with documents", () => {
      it("when empty", () => {
        const { result } = setup(false, []);

        expect(result.current.documents).toHaveLength(0);
      });

      it("when populated", () => {
        const { result } = setup(false, [stubBaseDocument]);

        expect(result.current.documents).toHaveLength(1);
      });
    });

    describe("with setFilterText", () => {
      describe("when disableSearch is false", () => {
        it("with a single document", () => {
          const stubDocument = { ...stubBaseDocument };

          const { result } = setup(false, [stubDocument]);

          act(() => result.current.filterConfig.onSearch(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(1);
        });

        it("with multiple documents", () => {
          const stubDocument = { ...stubBaseDocument };

          const { result } = setup(false, [stubDocument, stubDocument]);

          act(() => result.current.filterConfig.onSearch(stubDocument.fileName));

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
            const stubDocument = { ...stubBaseDocument };

            const { result } = setup(false, [stubDocument]);

            act(() => result.current.filterConfig.onSearch(queryString));

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
            const stubDocument = { ...stubBaseDocument, fileName: documentFileName };

            const { result } = setup(false, [stubDocument]);

            act(() => result.current.filterConfig.onSearch(queryCaseString));

            expect(result.current.documents).toHaveLength(1);
            expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
          });
        });

        it("when disableSearch is false all documents should return", () => {
          const stubDocument = { ...stubBaseDocument };

          const nonMatchingDocument = {
            ...stubDocument,
            fileName: "nonMatchingDocument",
          };

          const { result } = setup(true, [stubDocument, nonMatchingDocument]);

          act(() => result.current.filterConfig.onSearch(stubDocument.fileName));

          expect(result.current.documents).toHaveLength(2);
          expect(result.current.documents[0].fileName).toBe(stubDocument.fileName);
          expect(result.current.documents[1].fileName).toBe(nonMatchingDocument.fileName);
        });

        it("with single result", () => {
          const stubUnSearchableFileName = "THIS_ITEM_WILL_NEVER_BE_SEARCHED";

          const stubDocs = [
            stubBaseDocument,
            {
              ...stubBaseDocument,
              id: generateId("DocumentId"),
              fileName: stubUnSearchableFileName,
            },
          ];

          const { result } = setup(false, stubDocs);

          act(() => result.current.filterConfig.onSearch(stubDocs[0].fileName));

          expect(result.current.documents).toHaveLength(1);
          expect(result.current.documents[0].fileName).toBe(stubDocs[0].fileName);
        });

        it("with multiple results", () => {
          const stubCommonPartFileName = "testDoc";
          const stubNonMatchingFileName = "I_AM_A_FILENAME_THAT_WILL_NEVER_BE_SEARCHED";

          const stubDocs = [
            {
              ...stubBaseDocument,
              id: generateId("DocumentId"),
              fileName: `${stubCommonPartFileName} 1`,
            },
            {
              ...stubBaseDocument,
              id: generateId("DocumentId"),
              fileName: `${stubCommonPartFileName} 2`,
            },
            {
              ...stubBaseDocument,
              id: generateId("DocumentId"),
              fileName: stubNonMatchingFileName,
            },
          ];

          const { result } = setup(false, stubDocs);

          act(() => result.current.filterConfig.onSearch(stubCommonPartFileName));

          expect(result.current.documents).toHaveLength(2);
          expect(result.current.documents[0].fileName).toBe(stubDocs[0].fileName);
          expect(result.current.documents[1].fileName).toBe(stubDocs[1].fileName);

          // Negative check - we should not have the non matching doc
          const queryNonMatchingDoc = result.current.documents.find(x => x.fileName === stubNonMatchingFileName);

          expect(queryNonMatchingDoc).toBeUndefined();
        });

        describe("with particular data sets", () => {
          it("with date created", () => {
            const stubCommonPartFileName = "2021";

            const stubDocs = [
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 1",
                dateCreated: new Date(Date.UTC(2021, 1)),
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 2",
                dateCreated: new Date(Date.UTC(2021, 2)),
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 3",
                dateCreated: new Date(Date.UTC(2020, 2)),
              },
            ];

            const { result } = setup(false, stubDocs);

            act(() => result.current.filterConfig.onSearch(stubCommonPartFileName));

            expect(result.current.documents).toHaveLength(2);

            // Negative check - we should not have the non matching doc
            const queryNonMatchingDoc = result.current.documents.find(x => x.id === stubDocs[2].id);

            expect(queryNonMatchingDoc).toBeUndefined();
          });

          it("with file size", () => {
            const stubParsedFileSize = "12KB";

            const stubDocs = [
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 1",
                fileSize: 12459,
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 2",
                fileSize: 12459,
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 3",
                fileSize: 205732,
              },
            ];

            const { result } = setup(false, stubDocs);

            act(() => result.current.filterConfig.onSearch(stubParsedFileSize));

            expect(result.current.documents).toHaveLength(2);

            // Negative check - we should not have the non matching doc
            const queryNonMatchingDoc = result.current.documents.find(x => x.id === stubDocs[2].id);

            expect(queryNonMatchingDoc).toBeUndefined();
          });

          it("with uploaded by", () => {
            const stubUploadedName = "Innovate UK";

            const stubDocs = [
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 1",
                uploadedBy: stubUploadedName,
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 2",
                uploadedBy: stubUploadedName,
              },
              {
                ...stubBaseDocument,
                id: generateId("DocumentId"),
                fileName: "Document 3",
                uploadedBy: "Elton John",
              },
            ];

            const { result } = setup(false, stubDocs);

            act(() => result.current.filterConfig.onSearch(stubUploadedName));

            expect(result.current.documents).toHaveLength(2);

            // Negative check - we should not have the non matching doc
            const queryNonMatchingDoc = result.current.documents.find(x => x.id === stubDocs[2].id);

            expect(queryNonMatchingDoc).toBeUndefined();
          });
        });
      });
    });
  });
});
