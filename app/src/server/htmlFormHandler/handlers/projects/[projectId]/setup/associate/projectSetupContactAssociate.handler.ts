import { IContext } from "@framework/types/IContext";
import { UpdateProjectContactsAssociateDetailsCommand } from "@server/features/projectContacts/updateProjectContactsAssociateDetailsCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ContactSetupAssociateParams } from "@ui/pages/contact/associate/setup/ContactSetupAssociate.logic";
import { ContactSetupAssociateRoute } from "@ui/pages/contact/associate/setup/ContactSetupAssociate.page";
import {
  ContactSetupAssociateSchemaType,
  contactSetupAssociateSchema,
} from "@ui/pages/contact/associate/setup/ContactSetupAssociate.zod";
import { ProjectDashboardRoute } from "@ui/pages/projects/dashboard/Dashboard.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { contactSchemaErrorMap } from "@ui/zod/contactSchema.zod";
import { z } from "zod";

class ProjectSetupContactAssociateHandler extends ZodFormHandlerBase<
  ContactSetupAssociateSchemaType,
  ContactSetupAssociateParams
> {
  constructor() {
    super({
      routes: [ContactSetupAssociateRoute],
      forms: [FormTypes.ProjectSetupContactAssociate],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: contactSetupAssociateSchema,
      errorMap: contactSchemaErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ContactSetupAssociateSchemaType>> {
    const contacts: z.input<ContactSetupAssociateSchemaType>["contacts"] = [];

    for (let i = 0; true; i++) {
      const id = input[`contacts.${i}.id`];
      const day = input[`contacts.${i}.associateStartDate.day`];
      const month = input[`contacts.${i}.associateStartDate.month`];
      const year = input[`contacts.${i}.associateStartDate.year`];

      if (id && day && month && year) {
        contacts.push({ id, associateStartDate: { day, month, year } });
      } else {
        break;
      }
    }

    return {
      form: input.form,
      projectId: input.projectId,
      contacts,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<ContactSetupAssociateSchemaType>;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(new UpdateProjectContactsAssociateDetailsCommand(input.projectId, input.contacts));
    return ProjectDashboardRoute.getLink({}).path;
  }
}

export { ProjectSetupContactAssociateHandler };
