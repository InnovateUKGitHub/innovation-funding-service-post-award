import { Section } from "@ui/components/molecules/Section/section";
import { ManageTeamMemberMethod } from "../../ManageTeamMember.logic";
import { useContent } from "@ui/hooks/content.hook";
import { ReactNode } from "react";
import { useManageTeamMemberActionContext } from "../BaseManageTeamMember";

const ManageTeamMemberSection = ({ children }: { children?: ReactNode }) => {
  const { role, method, hideBottomSection } = useManageTeamMemberActionContext();
  const { getContent } = useContent();

  if (hideBottomSection) return null;

  return (
    <Section
      title={
        method === ManageTeamMemberMethod.REPLACE
          ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].heading)
          : undefined
      }
      subtitle={
        method === ManageTeamMemberMethod.REPLACE
          ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].subheading)
          : undefined
      }
    >
      {children}
    </Section>
  );
};

export { ManageTeamMemberSection };
