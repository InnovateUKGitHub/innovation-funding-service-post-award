import { Content } from "@ui/components/molecules/Content/content";

const ManageEmailMessage = () => {
  return (
    <div className="govuk-!-padding-bottom-9">
      <Content markdown value={x => x.pages.manageTeamMembers.modify.labels.changeEmail} />
    </div>
  );
};

export { ManageEmailMessage };
