import { SimpleString } from "@ui/components/renderers/simpleString";
import { IGuide } from "@framework/types/IGuide";
import { ReadonlyLabel } from "@ui/components/layout/readonlyLabel";

export const readonlyLabel: IGuide = {
  name: "Readonly Label",
  options: [
    {
      name: "Simple",
      comments: "Show a value",
      example: '<ReadonlyLabel label={"Partner name"}><SimpleString>Rose Dawson</SimpleString></ReadonlyLabel>',
      render: () => (
        <ReadonlyLabel label={"Partner name"}>
          <SimpleString>Rose Dawson</SimpleString>
        </ReadonlyLabel>
      ),
    },
  ],
};
