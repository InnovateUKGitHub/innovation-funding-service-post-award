import { useManageTeamMemberActionContext } from "../ManageTeamMemberCrud";
import { ReactNode } from "react";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { useManageTeamMemberFormContext } from "../ManageTeamMemberCrud.logic";

const ManageTeamMemberForm = ({ children }: { children: ReactNode }) => {
  const { method, role, projectId, pclId, memberToManage, onUpdate } = useManageTeamMemberActionContext();
  const { register, handleSubmit } = useManageTeamMemberFormContext();

  return (
    <Form onSubmit={handleSubmit(x => onUpdate({ data: x }))}>
      <input type="hidden" value={method} {...register("form")} />
      <input type="hidden" value={role} {...register("role")} />
      <input type="hidden" value={projectId} {...register("projectId")} />
      <input type="hidden" name="pclId" value={pclId} />
      <input type="hidden" {...register("contactId")} value={memberToManage?.pcl.contactId} />

      {children}
    </Form>
  );
};

export { ManageTeamMemberForm };
