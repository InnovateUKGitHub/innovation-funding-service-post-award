import { IInternationalisation } from "@framework/types/IContext";

export class TestInternationalisation implements IInternationalisation {
  public resourceBundles: any[] = [];

  public addResourceBundle(content: any): void {
    this.resourceBundles.push(content);
  }

  getValue(key: string): string | null {
    for (let resourceIndex = this.resourceBundles.length - 1; resourceIndex >= 0; resourceIndex--) {
      if (this.resourceBundles[resourceIndex][key]) {
        return this.resourceBundles[resourceIndex][key];
      }
    }
    return null;
  }

}
