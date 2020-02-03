import i18next from "i18next";

export class Content {
  public exampleContentTitle = () => i18next.t("example.contentTitle");
  public exampleContent = () => i18next.t("example.content");
}
