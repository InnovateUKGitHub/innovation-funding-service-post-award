import express from "express";
import contextProvider from "../features/common/contextProvider";
import { GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ClaimForecastRoute, ClaimsDashboardRoute, HomeRoute, PrepareClaimRoute, } from "../../ui/containers";
import { configureRouter } from "../../ui/routing/configureRouter";
import { serverRender } from "../serverRender";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ValidationError } from "../../shared/validation";

export const formRouter = express.Router();

const navigateTo = (link: ILinkInfo, res: express.Response, ) => {
    const router = configureRouter();
    const url = router.buildPath(link.routeName, link.routeParams);
    res.redirect(url);
};

const PrepareClaimForm = async (req: express.Request, res: express.Response) => {
    const params = { projectId: req.params.projectId, partnerId: req.params.partnerId, periodId: parseInt(req.params.periodId, 10) };
    const body = { comments: req.body.comments, button: req.body.button };

    const context = contextProvider.start({ user: req.session!.user });

    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));
    if (claim === null) {
        res.status(404).send("Unable to load claim");
        return;
    }

    claim.comments = body.comments;
    claim.status = ClaimStatus.DRAFT;

    try {
        await context.runCommand(new UpdateClaimCommand(claim));
        if (body.button === "default") {
            navigateTo(ClaimForecastRoute.getLink(params), res);
        }
        else {
            navigateTo(ClaimsDashboardRoute.getLink(params), res);
        }
        return;
    }
    catch (e) {
        const selector = getClaimEditor(params.partnerId, params.periodId);
        if (e instanceof ValidationError) {
            serverRender(req, res, { key: selector.key, store: selector.store, dto: claim, result: e.validationResult, error: null });
            return;
        }
        else {
            serverRender(req, res, { key: selector.key, store: selector.store, dto: claim, result: new ClaimDtoValidator(claim, [], [], false), error: e });
            return;
        }
    }
};

const ForcastClaimForm = async (req: express.Request, res: express.Response) => {
    const params = { projectId: req.params.projectId, partnerId: req.params.partnerId, periodId: parseInt(req.params.periodId, 10) };
    const body = {};

    const context = contextProvider.start({ user: req.session!.user });

    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));
    if (claim === null) {
        res.status(404).send("Unable to load claim");
        return;
    }

    claim.status = ClaimStatus.SUBMITTED;

    try {
        await context.runCommand(new UpdateClaimCommand(claim));
        navigateTo(ClaimsDashboardRoute.getLink(params), res);
        return;
    }
    catch (e) {
        const selector = getClaimEditor(params.partnerId, params.periodId);
        if (e instanceof ValidationError) {
            serverRender(req, res, { key: selector.key, store: selector.store, dto: claim, result: e.validationResult, error: null });
            return;
        }
        else {
            serverRender(req, res, { key: selector.key, store: selector.store, dto: claim, result: new ClaimDtoValidator(claim, [], [], false), error: e });
            return;
        }
    }
};

const HomeForm = async (req: express.Request, res: express.Response) => {
    const body = { user: req.body.user };
    if (body.user) {
        req.session!.user.email = body.user;
    }
    navigateTo(HomeRoute.getLink({}), res);
};

formRouter.post(PrepareClaimRoute.routePath, PrepareClaimForm);
formRouter.post(ClaimForecastRoute.routePath, ForcastClaimForm);
formRouter.post("/", HomeForm);
