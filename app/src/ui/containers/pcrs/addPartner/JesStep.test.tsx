import { render } from "@testing-library/react";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto, ProjectDto } from "@framework/dtos";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { configuration } from "@server/features/common";
import { BasePcrProps, JesStepUI, JesStepUIProps } from "@ui/containers/pcrs/addPartner/jeSStep";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<JesStepUI />", () => {
  const stubContent = {
    components: {
      documentGuidance: {
        uploadGuidance: "stub-uploadGuidance",
        fileSize: `stub-fileSize: {{maxFileSize}}`,
        uniqueFilename: "stub-uniqueFilename",
        noFilesNumberLimit: "stub-noFilesNumberLimit",
        fileTypesUpload: "stub-fileTypesUpload",
        pdfFiles: "stub-pdfFiles",
        textFiles: "stub-textFiles",
        presentationFiles: "stub-presentationFiles",
        spreadsheetFiles: "stub-spreadsheetFiles",
        availableImageExtensions: "stub-availableImageExtensions",
        fileTypesQuestion: "stub-fileTypesQuestion",
      },
    },
    pages: {
      pcrAddPartnerJes: {
        jesIntroduction: "stub-jesIntroduction",
        jesListItem1LinkContent: "stub-jesListItem1LinkContent",
        jesListItem2BeforeLink: "stub-jesListItem2BeforeLink",
        jesWebsiteLinkContent: "stub-jesWebsiteLinkContent",
        jesUploadSupport: "stub-jesUploadSupport",
      },
    },
    pcrItem: {
      submitButton: "stub-submitButton",
      returnToSummaryButton: "stub-returnToSummaryButton",
    },
    pcrAddPartnerLabels: {
      jesHeading: "stub-jesHeading",
    },
    documentLabels: {
      uploadInputLabel: "stub-uploadInputLabel",
      documentDisplayTitle: "stub-documentDisplayTitle",
      documentDisplaySubTitle: "stub-documentDisplaySubTitle",
    },
    documentMessages: {
      uploadTitle: "stub-uploadTitle",
      noDocumentsUploaded: "stub-noDocumentsUploaded",
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
    project: {
      competitionType: "CR&D",
    } as ProjectDto,
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

  const setup = (props?: Partial<JesStepUIProps>) =>
    render(
      <TestBed stores={stubStore as TestBedStore}>
        <JesStepUI {...stubBasePcrProps} {...requiredJesStepUIProps} {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  describe("@returns", () => {
    test("as default", () => {
      const { queryByTestId } = setup();

      const jestUploadForm = queryByTestId("saveAndContinue");

      expect(jestUploadForm).toBeInTheDocument();
    });

    test("with competition type KTP", () => {
      const ktpProject = {
        ...stubBasePcrProps,
        project: { ...stubBasePcrProps.project, competitionType: "KTP" },
      } as any;
      const { queryByTestId } = setup(ktpProject);
      expect(queryByTestId("jes-form-ktp-not-needed-info-message")).toBeInTheDocument();
    });

    describe("returns content", () => {
      describe("without any conditional logic", () => {
        const conditionalContentToExclude = ["jesIntroduction"];
        const unconditionalContent = Object.entries(stubContent.pages.pcrAddPartnerJes).filter(
          ([key]) => !conditionalContentToExclude.includes(key),
        );

        test.each(unconditionalContent)("with %s", (_key, value) => {
          const { queryByText } = setup();

          const contentElement = queryByText(value);

          expect(contentElement).toBeInTheDocument();
        });
      });

      describe("with conditional logic", () => {
        test("when documents are available", () => {
          const conditionalText = stubContent.documentLabels.documentDisplaySubTitle;
          const availableDocument: JesStepUIProps["documents"][0] = {
            link: "stub-link",
            fileName: "stub-filename",
            id: "stub-id",
            description: 70,
            fileSize: 279611,
            dateCreated: new Date(),
            uploadedBy: "Innovate UK",
            uploadedByPartnerName: "",
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
