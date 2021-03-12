import { render } from "@testing-library/react";

import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

import { MultipleDocumentUploadDto } from "@framework/dtos";
import { TestBed, TestBedContent } from "@shared/TestBed";

import { Configuration } from "@server/features/common";
import { JesStepUI, JesStepUIProps, BasePcrProps } from "@ui/containers/pcrs/addPartner/jeSStep";
import { generateContentArray } from "../../../test-utils/generate-content-array";

describe("<JesStepUI />", () => {
  // TODO: Create global stub of content, to stop this required stub from being made for each usage
  const stubContentForComponentElements = {
    components: {
      documents: {
        labels: {
          documentDescriptionLabel: jest.fn().mockReturnValue({ content: "stub-documentDescriptionLabel" }),
        },
      },
      documentGuidance: {
        uploadGuidance: { content: "stub-uploadGuidance" },
        fileSize: { content: "stub-fileSize" },
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
        filesUploadedTitle: { content: "stub-filesUploadedTitle" },
        filesUploadedSubtitle: { content: "stub-filesUploadedSubtitle" }, // TODO: Conditional test
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
        validator: new MultipleDocumentUpdloadDtoValidator(stubFiles, Configuration.options, false, true, null),
        status: 1,
        error: null,
      },
      validator: null as any,
      status: null as any,
      onChange: jest.fn(),
      onSave: jest.fn(),
      getRequiredToCompleteMessage: jest.fn(),
      isClient: true,
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
      <TestBed content={(stubContent as unknown) as TestBedContent}>
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
        const conditionalContentToExclude = ["filesUploadedSubtitle"];
        const unconditionalContent = contentToCheck.filter(([key]) => !conditionalContentToExclude.includes(key));

        test.each(unconditionalContent)("with %s", (_key, value) => {
          const { queryByText } = setup();

          const contentElement = queryByText(value);

          expect(contentElement).toBeInTheDocument();
        });
      });

      describe("with conditional logic", () => {
        test("when documents are available", () => {
          const conditionalText = stubContent.pcrAddPartnerJeS.documentLabels.filesUploadedSubtitle.content;
          const availableDocument: JesStepUIProps["documents"][0] = {
            link: "stub-link",
            fileName: "stub-filename",
            id: "stub-id",
            description: 70,
            fileSize: 279611,
            dateCreated: new Date(),
            uploadedBy: "Innovate UK",
          };

          const { queryByText } = setup({ documents: [availableDocument] });

          const conditionalElement = queryByText(conditionalText);

          expect(conditionalElement).toBeInTheDocument();
        });
      });
    });
  });
});
