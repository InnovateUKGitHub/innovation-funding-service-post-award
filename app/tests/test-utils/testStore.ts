import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import getRootState from "@ui/redux/stores/getRootState";
import { TestContext } from "./testContextProvider";
import { LoadingStatus } from "@framework/constants/enums";
import { Partner } from "@framework/entities/partner";
import { GetAllClaimsForProjectQuery } from "@server/features/claims/getAllClaimsForProjectQuery";
import { ISalesforceClaim } from "@server/repositories/claimsRepository";
import { ISalesforceProject } from "@server/repositories/projectsRepository";
import { dataLoadAction } from "@ui/redux/actions/common/dataLoad";
import { RootActionsOrThunk } from "@ui/redux/actions/root";
import { RootState, rootReducer } from "@ui/redux/reducers/rootReducer";
import { GetAllQuery as GetAllProjects } from "@server/features/projects/getAllQuery";
import { GetByIdQuery as GetProjectById } from "@server/features/projects/getDetailsByIdQuery";
import { GetAllQuery as GetAllPartners } from "@server/features/partners/getAllQuery";
import { GetByIdQuery as GetPartnerById } from "@server/features/partners/getByIdQuery";
import { GetAllForPartnerQuery as GetAllClaimsForPartner } from "@server/features/claims/getAllForPartnerQuery";

export class TestStore {
  public getState: () => RootState;
  public dispatch: (action: RootActionsOrThunk) => void;

  constructor(private readonly context: TestContext) {
    const initialState = getRootState();
    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, initialState, middleware);
    this.dispatch = store.dispatch as (action: RootActionsOrThunk) => void;
    this.getState = store.getState;
  }

  public async createProject(update?: (item: ISalesforceProject) => void) {
    const project = this.context.testData.createProject(update);
    const projectDto = await this.context.runQuery(new GetProjectById(project.Id));
    const projectDtos = await this.context.runQuery(new GetAllProjects());
    this.dispatch(dataLoadAction(storeKeys.getProjectKey(projectDto.id), "project", LoadingStatus.Done, projectDto));
    this.dispatch(dataLoadAction(storeKeys.getProjectsKey(), "projects", LoadingStatus.Done, projectDtos));
    return project;
  }

  public async createPartner(project?: ISalesforceProject, update?: (item: Partner) => void) {
    const partner = this.context.testData.createPartner(project, update);
    const partnerDto = await this.context.runQuery(new GetPartnerById(partner.id));
    const partnerDtos = await this.context.runQuery(new GetAllPartners());
    this.dispatch(dataLoadAction(storeKeys.getPartnerKey(partner.id), "partner", LoadingStatus.Done, partnerDto));
    this.dispatch(dataLoadAction(storeKeys.getPartnersKey(), "partners", LoadingStatus.Done, partnerDtos));
    return partner;
  }

  public async createClaim(partner: Partner, periodId?: number, update?: (item: ISalesforceClaim) => void) {
    const claim = this.context.testData.createClaim(partner, periodId, update);
    const partnerClaims = await this.context.runQuery(new GetAllClaimsForPartner(partner.id));
    const projectClaims = await this.context.runQuery(new GetAllClaimsForProjectQuery(partner.projectId));
    this.dispatch(dataLoadAction(storeKeys.getPartnerKey(partner.id), "claims", LoadingStatus.Done, partnerClaims));
    this.dispatch(
      dataLoadAction(storeKeys.getProjectKey(partner.projectId), "claims", LoadingStatus.Done, projectClaims),
    );
    return claim;
  }
}
