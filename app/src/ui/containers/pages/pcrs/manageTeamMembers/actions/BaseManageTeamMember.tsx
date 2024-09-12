import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BaseProps } from "@ui/containers/containerBase";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { createContext, ReactNode, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import {
  getManageTeamMember,
  ManageTeamMemberData,
  ManageTeamMemberProps,
  ManageTeamMemberRole,
  ManageTeamMemberRoles,
  ManageTeamMembersTableData,
  useManageTeamMembers,
  useManageTeamMembersQuery,
} from "../ManageTeamMember.logic";
import { useOnManageTeamMemberSubmit } from "./ManageTeamMember.logic";
import {
  manageTeamMemberErrorMap,
  manageTeamMemberValidator,
  ManageTeamMemberValidatorSchema,
} from "./ManageTeamMember.zod";
import { ManageTeamMemberMethod, ManageTeamMemberMethods } from "@framework/constants/pcrConstants";

interface ManageTeamMembersActionContext {
  collated: Map<ProjectContactLinkId, ManageTeamMembersTableData>;
  categories: {
    projectManagers: ManageTeamMembersTableData[];
    financeContacts: ManageTeamMembersTableData[];
    associates: ManageTeamMembersTableData[];
    mainCompanyContacts: ManageTeamMembersTableData[];
    knowledgeBaseAdministrators: ManageTeamMembersTableData[];
  };
  partners: Pick<PartnerDto, "id" | "accountId" | "name">[];
  isFetching: boolean;
  onUpdate: ReturnType<typeof useOnManageTeamMemberSubmit>["onUpdate"];
  memberToManage: ReturnType<typeof getManageTeamMember>["memberToManage"];
  defaults: ReturnType<typeof getManageTeamMember>["defaults"];
  hideBottomSection: boolean;
  projectId: ProjectId;
  pclId: ProjectContactLinkId | undefined;
  defaultPclId: ProjectContactLinkId | undefined | "undefined";
  role: ManageTeamMemberRole;
  method:
    | ManageTeamMemberMethod.CREATE
    | ManageTeamMemberMethod.REPLACE
    | ManageTeamMemberMethod.UPDATE
    | ManageTeamMemberMethod.DELETE;
  backRoute: ILinkInfo;
}

const ManageTeamMemberActionContext = createContext<undefined | ManageTeamMembersActionContext>(undefined);

const ManageTeamMemberActionProvider = ({
  data,
  children,
}: {
  data: ManageTeamMembersActionContext;
  children: ReactNode;
}) => <ManageTeamMemberActionContext.Provider value={data}>{children}</ManageTeamMemberActionContext.Provider>;

const useManageTeamMemberActionContext = () => {
  const context = useContext(ManageTeamMemberActionContext);
  if (context === undefined) {
    throw new Error("Manage Team Member components must be used within the ManageTeamMemberAction component");
  }
  return context;
};

type ManageTeamMemberModifyProps = BaseProps & ManageTeamMemberProps;

type BaseManageTeamMemberProps = ManageTeamMemberModifyProps &
  ManageTeamMemberData & {
    children: ReactNode;
  };

const BaseManageTeamMember = ({
  projectId,
  pclId: defaultPclId,
  role,
  method,
  children,
}: BaseManageTeamMemberProps) => {
  const { getContent } = useContent();
  const routes = useRoutes();
  const backRoute = routes.projectManageTeamMembersDashboard.getLink({ projectId });
  const methods = useForm<z.output<ManageTeamMemberValidatorSchema>>({
    resolver: zodResolver(manageTeamMemberValidator, { errorMap: manageTeamMemberErrorMap }),
    defaultValues: {
      pclId: defaultPclId,
    },
  });
  const { setError, formState, watch } = methods;
  const pclId = watch("pclId");

  const { onUpdate, isFetching, apiError } = useOnManageTeamMemberSubmit({ projectId });
  const validationErrors = useZodErrors<z.output<ManageTeamMemberValidatorSchema>>(setError, formState.errors);

  const { collated, categories, fragmentRef, partners } = useManageTeamMembersQuery({ projectId });
  const { memberToManage, defaults, hideBottomSection } = useManageTeamMembers({ pclId, collated, method });

  const validPage =
    ManageTeamMemberMethods.includes(method) &&
    ManageTeamMemberRoles.includes(role) &&
    // If we are NOT in create, check the PCL matches the role we are changing
    (method === ManageTeamMemberMethod.CREATE || (memberToManage ? memberToManage.role === role : true));

  return (
    <Page
      heading={
        validPage
          ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].title)
          : getContent(x => x.pages.manageTeamMembers.modify.messages.invalid.title)
      }
      backLink={<BackLink route={backRoute}>{getContent(x => x.pages.manageTeamMembers.modify.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
      apiError={apiError}
    >
      <P>
        {validPage ? (
          getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].subtitle)
        ) : (
          <Content
            value={x => x.pages.manageTeamMembers.modify.messages.invalid.subtitle}
            components={[
              <Link key="0" styling="Link" route={backRoute}>
                {" "}
              </Link>,
            ]}
          />
        )}
      </P>

      {validPage && (
        <ManageTeamMemberActionProvider
          data={{
            projectId,
            defaultPclId,
            pclId,
            role,
            method,
            collated,
            categories,
            partners,
            onUpdate,
            isFetching,
            memberToManage,
            defaults,
            hideBottomSection,
            backRoute,
          }}
        >
          <FormProvider {...methods}>{children}</FormProvider>
        </ManageTeamMemberActionProvider>
      )}
    </Page>
  );
};

export {
  BaseManageTeamMember,
  BaseManageTeamMemberProps,
  ManageTeamMemberModifyProps,
  useManageTeamMemberActionContext,
};
