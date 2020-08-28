import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";

export class PCRNameChangeContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-name-change", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRNameChangeLabels(this, this.project);

  public readonly selectPartnerHeading = () => this.getContent("heading-select-partner");
  public readonly enterNameHeading = () => this.getContent("heading-enter-name");
}
