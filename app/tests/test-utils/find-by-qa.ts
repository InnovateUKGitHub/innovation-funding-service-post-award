import { ReactWrapper } from "enzyme";

export const findByQa = (element: ReactWrapper, ref: string) => element.find(`[data-qa="${ref}"]`).hostNodes();
