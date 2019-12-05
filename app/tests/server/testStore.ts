import getRootState from "../redux/stores/getRootState";
import { applyMiddleware, createStore } from "redux";
import { rootReducer, RootState } from "@ui/redux";
import { LoadingStatus } from "@shared/pending";
import { dataLoadAction, RootActionsOrThunk } from "@ui/redux/actions";
import * as Repositories from "@server/repositories";
import { TestContext } from "./testContextProvider";
import { GetAllQuery as GetAllProjects, GetByIdQuery as GetProjectById } from "@server/features/projects";
import { GetAllQuery as GetAllPartners, GetByIdQuery as GetPartnerById } from "@server/features/partners";
import { GetAllClaimsForProjectQuery, GetAllForPartnerQuery as GetAllClaimsForPartner } from "@server/features/claims";
import thunk from "redux-thunk";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class TestStore {

  public getState: () => RootState;
  public dispatch: (action: RootActionsOrThunk) => void;

  constructor(private context: TestContext) {
    const initialState = getRootState();
    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, initialState, middleware);
    this.dispatch = store.dispatch as any;
    this.getState = store.getState;
  }

  public async createProject(update?: (item: Repositories.ISalesforceProject) => void) {
    const project = this.context.testData.createProject(update);
    const projectDto = await this.context.runQuery(new GetProjectById(project.Id));
    const projectDtos = await this.context.runQuery(new GetAllProjects());
    this.dispatch(dataLoadAction(storeKeys.getProjectKey(projectDto.id), "project", LoadingStatus.Done, projectDto));
    this.dispatch(dataLoadAction(storeKeys.getProjectKey(), "projects", LoadingStatus.Done, projectDtos));
    return project;
  }

  public async createPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
    const partner = this.context.testData.createPartner(project, update);
    const partnerDto = await this.context.runQuery(new GetPartnerById(partner.Id));
    const partnerDtos = await this.context.runQuery(new GetAllPartners());
    this.dispatch(dataLoadAction(storeKeys.getPartnerKey(partner.Id), "partner", LoadingStatus.Done, partnerDto));
    this.dispatch(dataLoadAction(storeKeys.getPartnerKey(), "partners", LoadingStatus.Done, partnerDtos));
    return partner;
  }

  public async createClaim(partner: Repositories.ISalesforcePartner, periodId?: number, update?: (item: Repositories.ISalesforceClaim) => void) {
    const claim = this.context.testData.createClaim(partner, periodId, update);
    const partnerClaims = await this.context.runQuery(new GetAllClaimsForPartner(partner.Id));
    const projectClaims = await this.context.runQuery(new GetAllClaimsForProjectQuery(partner.Acc_ProjectId__r.Id));
    this.dispatch(dataLoadAction(storeKeys.getPartnerKey(partner.Id), "claims", LoadingStatus.Done, partnerClaims));
    this.dispatch(dataLoadAction(storeKeys.getProjectKey(partner.Acc_ProjectId__r.Id), "claims", LoadingStatus.Done, projectClaims));
    return claim;
  }
}
