import { IGuide } from "@framework/types/IGuide";
import { Info } from "@ui/components/layout/info";

export const info: IGuide = {
  name: "Info",
  options: [
    {
      name: "Simple",
      comments: "Help with nationality",
      example:
        '<Info summary="Help with nationality.">We need to know your nationality so we can work out which elections...</Info>',
      render: () => (
        <Info summary="Help with nationality">
          We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot
          provide your nationality, you’ll have to send copies of identity documents through the post.
        </Info>
      ),
    },
  ],
};
