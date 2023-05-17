import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestBed from "@shared/TestBed";
import { PostcodeEdit, PostcodeProps } from "./PostcodeEdit";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("PostcodeEdit", () => {
  afterEach(jest.clearAllMocks);

  const stubContent = {
    pages: {
      partnerDetailsEdit: {
        sectionTitlePostcode: "Postcode Section Title",
        labelCurrentPostcode: "Current Postcode Label",
        labelNewPostcode: "New Postcode Label",
        hintNewPostcode: "New Postcode Hint",
      },
    },
  };

  const defaultProps: PostcodeProps = {
    partner: {
      postcode: "AB1 2CD",
    },
    displayCurrentPostcode: false,
    onUpdate: jest.fn(),
    saveButtonContent: "Save",
    editor: {
      data: {
        postcode: "SN2 1ET",
      },
    },
  } as unknown as PostcodeProps;

  const setup = (props: Partial<PostcodeProps> = {}) =>
    render(
      <TestBed>
        <PostcodeEdit {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  it("should render as expected", () => {
    expect(setup().container).toMatchSnapshot();
  });

  it("should render with the current postcode value when displayCurrentPostcode is true", () => {
    const { container } = setup({ displayCurrentPostcode: true });
    expect(container).toMatchSnapshot();
  });

  it("should allow updating of postcode", async () => {
    const { getByLabelText, getByText } = setup();
    const input = getByLabelText(stubContent.pages.partnerDetailsEdit.labelNewPostcode);
    await userEvent.clear(input);
    await userEvent.type(input, "ED1 5ZX");
    const submit = getByText("Save");
    await userEvent.click(submit);
    expect(defaultProps.onUpdate).toHaveBeenCalledWith(true, { postcode: "ED1 5ZX" });
  });
});
