import type { ClientFileWrapper } from "@client/clientFileWrapper";
import { ServerFileWrapper } from "./controllerBase";

const IsomorphicFileWrapper: typeof ServerFileWrapper | typeof ClientFileWrapper = ServerFileWrapper;

export { IsomorphicFileWrapper };
