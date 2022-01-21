import bytes from "bytes";
import { render } from "@testing-library/react";

import { MultipleDocumentUploadDtoValidator } from "@ui/validators";

import { MultipleDocumentUploadDto } from "@framework/dtos";
import { TestBed, TestBedContent, TestBedStore } from "@shared/TestBed";

import { configuration } from "@server/features/common";
import { JesStepUI, JesStepUIProps, BasePcrProps } from "@ui/containers/pcrs/addPartner/jeSStep";
import { ContentResult } from "@content/contentBase";
import { generateContentArray } from "../../../test-utils/generate-content-array";

describe("<JesStepUI />", () => {
  // TODO: Create global stub of content, to stop this required stub from being made for each usage
  const stubContentForComponentElements = {
    components: {
      documents: {
        labels: {
          documentDisplayTitle: { content: "stub-documentDisplayTitle" },
          documentDisplaySubTitle: { content: "stub-documentDisplaySubTitle" },
          documentDescriptionLabel: jest.fn().mockReturnValue({ content: "stub-documentDescriptionLabel" }),
        },
        messages: {
          noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
        },
      },
      documentGuidance: {
        uploadGuidance: { content: "stub-uploadGuidance" },
        fileSize: (size: number): ContentResult => ({
          key: "test-key",
          content: `stub-fileSize: ${bytes(size)}`,
          markdown: false,
        }),
        uniqueFilename: { content: "stub-uniqueFilename" },
        noFilesNumberLimit: { content: "stub-noFilesNumberLimit" },
        fileTypesUpload: { content: "stub-fileTypesUpload" },
        pdfFiles: { content: "stub-pdfFiles" },
        textFiles: { content: "stub-textFiles" },
        presentationFiles: { content: "stub-presentationFiles" },
        spreadsheetFiles: { content: "stub-spreadsheetFiles" },
        availableImageExtensions: { content: "stub-availableImageExtensions" },
        fileTypesQuestion: { content: "stub-fileTypesQuestion" },
      },
    },
  };

  const stubContent = {
    ...stubContentForComponentElements,
    pcrAddPartnerJeS: {
      pcrItem: {
        submitButton: { content: "stub-submitButton" },
        returnToSummaryButton: { content: "stub-returnToSummaryButton" },
      },
      labels: {
        jesHeading: { content: "stub-jesHeading" },
      },
      documentLabels: {
        uploadInputLabel: { content: "stub-uploadInputLabel" },
        documentDisplayTitle: { content: "stub-documentDisplayTitle" },
        documentDisplaySubTitle: { content: "stub-documentDisplaySubTitle" },
      },
      documentMessages: {
        uploadTitle: { content: "stub-uploadTitle" },
        noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
      },
      jesWebsiteLinkContent: { content: "stub-jesWebsiteLinkContent" },
      jesIntroduction: { content: "stub-jesIntroduction" },
      jesListItem2: { content: "stub-jesListItem2" },
      jesUploadSupport: { content: "stub-jesUploadSupport" },
      jesListItem1LinkContent: { content: "stub-jesListItem1LinkContent" },
    },
  };

  const stubStore = {
    config: {
      getConfig: () => ({
        options: {
          maxFileSize: 1024,
        },
        features: {
          contentHint: false,
        },
      }),
    },
    users: {
      getCurrentUser: jest.fn().mockReturnValue({ csrf: "stub-csrf" }),
    },
  } as any;

  const setup = (props?: Partial<JesStepUIProps>) => {
    const stubFiles: MultipleDocumentUploadDto = {
      files: [
        {
          fileName: "stub-fileName",
          size: 1024,
        },
      ],
    };

    // TODO: Create generic "BasePcrProps" TestBed so that each workflow requires a lot less pain!
    const stubBasePcrProps: BasePcrProps = {
      project: null as any,
      pcr: null as any,
      pcrItem: null as any,
      pcrItemType: null as any,
      documentsEditor: {
        data: { files: [] },
        validator: new MultipleDocumentUploadDtoValidator(stubFiles, configuration.options, false, true, null),
        status: 1,
        error: null,
      },
      validator: null as any,
      status: null as any,
      onChange: jest.fn(),
      onSave: jest.fn(),
      getRequiredToCompleteMessage: jest.fn(),
      routes: {} as any,
      mode: "prepare",
    };

    const requiredJesStepUIProps: Pick<JesStepUIProps, "documents" | "onSubmit" | "onFileChange" | "onFileDelete"> = {
      documents: [],
      onSubmit: jest.fn(),
      onFileChange: jest.fn(),
      onFileDelete: jest.fn(),
    };

    return render(
      <TestBed content={(stubContent as unknown) as TestBedContent} stores={stubStore as TestBedStore}>
        <JesStepUI {...stubBasePcrProps} {...requiredJesStepUIProps} {...props} />
      </TestBed>,
    );
  };

  describe("@returns", () => {
    test("as default", () => {
      const { queryByTestId } = setup();

      const jestUploadForm = queryByTestId("saveAndContinue");

      expect(jestUploadForm).toBeInTheDocument();
    });

    describe("returns content", () => {
      const contentToCheck = generateContentArray(stubContent.pcrAddPartnerJeS);

      describe("without any conditional logic", () => {
        const conditionalContentToExclude = ["documentDisplaySubTitle"];
        const unconditionalContent = contentToCheck.filter(([key]) => !conditionalContentToExclude.includes(key));

        test.each(unconditionalContent)("with %s", (_key, value) => {
          const { queryByText } = setup();

          const contentElement = queryByText(value);

          expect(contentElement).toBeInTheDocument();
        });
      });

      describe("with conditional logic", () => {
        test("when documents are available", () => {
          const conditionalText = stubContent.pcrAddPartnerJeS.documentLabels.documentDisplaySubTitle.content;
          const availableDocument: JesStepUIProps["documents"][0] = {
            link: "stub-link",
            fileName: "stub-filename",
            id: "stub-id",
            description: 70,
            fileSize: 279611,
            dateCreated: new Date(),
            uploadedBy: "Innovate UK",
            isOwner: false,
          };

          const { queryByText } = setup({ documents: [availableDocument] });

          const conditionalElement = queryByText(conditionalText);

          expect(conditionalElement).toBeInTheDocument();
        });
      });
    });
  });
});
