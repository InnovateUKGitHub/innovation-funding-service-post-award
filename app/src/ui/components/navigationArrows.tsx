import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Link } from "@ui/components/links";
import { ArrowLeft, ArrowRight } from "@ui/components/svg/arrows";

interface LinkProps {
  label: string;
  route: ILinkInfo;
}

interface NavigationArrowsProps {
  previousLink?: LinkProps | null;
  nextLink?: LinkProps | null;
}

export const NavigationArrows = ({ previousLink, nextLink }: NavigationArrowsProps) => {
  if (!previousLink && !nextLink) return null;

  return (
    <div className="govuk-navigation-arrows">
      {previousLink && <NavigationArrow {...previousLink} direction="left" name="Previous" qa="arrow-right" />}

      {nextLink && <NavigationArrow {...nextLink} direction="right" name="Next" qa="arrow-left" />}
    </div>
  );
};

type NavigationArrowProps = LinkProps & {
  name: string;
  direction: "left" | "right";
  qa?: string;
};

const directionOptions: Record<NavigationArrowProps["direction"], typeof ArrowLeft | typeof ArrowRight> = {
  left: ArrowLeft,
  right: ArrowRight,
};

const NavigationArrow = ({ direction, label, route, name, qa }: NavigationArrowProps) => {
  const Icon = directionOptions[direction];

  return (
    <Link route={route} replace className="govuk-navigation-arrows__button">
      <Icon data-qa={`govuk-navigation-arrow-${direction}`} className="govuk-navigation-arrows__button__arrow" />

      <div data-qa={qa} className="govuk-navigation-arrows__button__label">
        <span>{name}</span>

        <span className="govuk-navigation-arrows__button__label__category">{label}</span>
      </div>
    </Link>
  );
};
