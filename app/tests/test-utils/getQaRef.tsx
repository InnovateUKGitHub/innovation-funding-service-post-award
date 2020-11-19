// tslint:disable-next-line: import-blacklist
import Enzyme from "enzyme";

export const getDataQA = (wrapper: Enzyme.ReactWrapper, ref: string): Enzyme.ReactWrapper => wrapper.find(`[data-qa="${ref}"]`);
