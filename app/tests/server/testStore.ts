import getRootState from "../redux/selectors/getRootState";
import { AnyAction, createStore } from "redux";
import { createStores, IStores, rootReducer, RootState } from "@ui/redux";
import { LoadingStatus } from "@shared/pending";
import { dataLoadAction, RootActionsOrThunk } from "@ui/redux/actions";
import { partnersStore, partnerStore, projectsStore, projectStore } from "@ui/redux/selectors";
import * as Repositories from "@server/repositories";
import { TestContext } from "./testContextProvider";
import { GetAllQuery as GetAllProjects, GetByIdQuery as GetProjectById } from "@server/features/projects";
import { GetAllQuery as GetAllPartners, GetByIdQuery as GetPartnerById } from "@server/features/partners";

export class TestStore {

  public getState: () => RootState;
  public dispatch: (action: RootActionsOrThunk) => void;

  constructor(private context: TestContext) {
    const initialState = getRootState();
    const store = createStore(rootReducer, initialState);
    this.dispatch = store.dispatch as any;
    this.getState = store.getState;
  }

  public async createProject(update?: (item: Repositories.ISalesforceProject) => void) {
    const project = this.context.testData.createProject(update);
    const projectDto = await this.context.runQuery(new GetProjectById(project.Id));
    const projectDtos = await this.context.runQuery(new GetAllProjects());
    this.dispatch(dataLoadAction(projectDto.id, projectStore, LoadingStatus.Done, projectDto));
    this.dispatch(dataLoadAction("all", projectsStore, LoadingStatus.Done, projectDtos));
    return project;
  }

  public async createPartner(project?: Repositories.ISalesforceProject, update?: (item: Repositories.ISalesforcePartner) => void) {
    const partner = this.context.testData.createPartner(project, update);
    const partnerDto = await this.context.runQuery(new GetPartnerById(partner.Id));
    const partnerDtos = await this.context.runQuery(new GetAllPartners());
    this.dispatch(dataLoadAction(partnerDto.id, partnersStore, LoadingStatus.Done, partnerDto));
    this.dispatch(dataLoadAction("all", partnersStore, LoadingStatus.Done, partnerDtos));
    return partner;
  }
}
