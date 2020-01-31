import { IResources } from "@framework/types/IContext";

export class TestResources implements IResources {
  private _defaultContent: string = "";

  public defaultContent = new DefaultContent();
}

class DefaultContent {
  private content = "";
  public getContent = () => Promise.resolve(this.content);
  public setContent = (value: string) => this.content = value;
}
