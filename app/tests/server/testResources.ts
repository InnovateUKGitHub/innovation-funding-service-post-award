import { IResources } from "@framework/types/IContext";

export class TestResources implements IResources {
  public defaultContent = new TestDefaultContent();
  public customContent = new TestCustomContent();
}

class TestDefaultContent {
  private content = "";
  public getContent = () => Promise.resolve(this.content);
  public setContent = (value: string) => this.content = value;
}

class TestCustomContent {
  private content = "";
  private info = { lastModified: new Date("1970/01/01") };

  public getContent = () => Promise.resolve(this.content);
  public setContent = (value: string, lastModified: Date = new Date()) => {
    this.content = value;
    this.info = { lastModified };
  }

  getInfo = () => Promise.resolve(this.info);
  setInfo = (value: { lastModified: Date }) => this.info = value;
}
