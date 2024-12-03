import { Fixture } from "playwright-bdd/decorators";
import { IfsLoginPage } from "./IfsLoginPage";

export
@Fixture("ifsAuthNavigation")
class IfsAuthNavigation {
  private readonly ifsLoginPage: IfsLoginPage;

  public static async create(
    {
      ifsLoginPage,
    }: {
      ifsLoginPage: IfsLoginPage;
    },
    use: (x: IfsAuthNavigation) => Promise<void>,
  ) {
    use(
      new IfsAuthNavigation({
        ifsLoginPage,
      }),
    );
  }

  constructor({ ifsLoginPage }: { ifsLoginPage: IfsLoginPage }) {
    this.ifsLoginPage = ifsLoginPage;
  }

  async gotoLoginPage() {
    await this.ifsLoginPage.goto();
  }
}
