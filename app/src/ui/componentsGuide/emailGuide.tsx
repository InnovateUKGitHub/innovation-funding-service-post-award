import { IGuide } from "@framework/types/IGuide";
import { Email } from "@ui/components/renderers/email";

export const emailGuide: IGuide = {
  name: "Email",
  options: [
    {
      name: "Simple",
      comments: "Renders an email link",
      example: '<Email value="test@test.com"/>',
      render: () => <Email>test@test.com</Email>,
    },
  ],
};
