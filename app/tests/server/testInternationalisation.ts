import { IInternationalisation } from "@framework/types/IContext";

export class TestInternationalisation implements IInternationalisation {
  public resourceBundles: any[] = [];

  public addResourceBundle(content: any): void {
    this.resourceBundles.push(content);
  }
}
