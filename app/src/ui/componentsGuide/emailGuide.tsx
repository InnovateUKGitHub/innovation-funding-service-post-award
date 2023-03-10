import { IGuide } from "@framework/types";
import { Email } from "../components/renderers";

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
