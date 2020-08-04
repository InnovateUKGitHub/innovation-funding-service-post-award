import { IResources } from "@framework/types/IContext";
import { ICompaniesHouse } from "@server/resources/companiesHouse";
import { IBankCheckService, IVerifyBankCheckInputs } from "@server/resources/bankCheckService";
import { BankCheckCondition } from "@framework/types/bankCheck";

export class TestResources implements IResources {
  public defaultContent = new TestDefaultContent();
  public customContent = new TestCustomContent();
  public companiesHouse = new TestCompaniesHouse();
  public bankCheckService = new TestBankCheckService();
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

class TestCompaniesHouse implements ICompaniesHouse {
  private readonly results = [
    {
      title: "BJSS LIMITED",
      companyNumber: "02777575",
      address: {
        addressLine1: "Queen Street",
        addressLine2: "Queen Street 2",
        region: "West Yorkshire",
        premises: "First Floor Coronet House",
        locality: "Leeds",
        postalCode: "LS1 2TW"
      }
    }
  ];
  public searchCompany = () => Promise.resolve(this.results);
}

type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
type MatchFlag = "Match" | "No Match" | null;

class TestBankCheckService implements IBankCheckService {
  private readonly passConditions: BankCheckCondition = {
    severity: "warning",
    code: 2,
    description: "description"
  };

  private readonly failConditions: BankCheckCondition = {
    severity: "error",
    code: 3,
    description: "error description"
  };

  private readonly passValidation = {
    ValidationResult: {
      checkPassed: true,
      iban: "123456",
      conditions: this.passConditions
    }
  };

  private readonly failValidation = {
    ValidationResult: {
      checkPassed: false,
      iban: null,
      conditions: this.failConditions
    }
  };

  private readonly passVerify = {
    VerificationResult: {
      addressScore: 7 as Score,
      companyNameScore: 8 as Score,
      personalDetailsScore: 7 as Score,
      regNumberScore: "Match" as MatchFlag,
      conditions: this.passConditions,
    }
  };

  private readonly failVerify = {
    VerificationResult: {
      addressScore: 0 as Score,
      companyNameScore: 1 as Score,
      personalDetailsScore: 2 as Score,
      regNumberScore: "No Match" as MatchFlag,
      conditions: this.failConditions,
    }
  };

  private validateResult(sortcode: string, accountNumber: string) {
    if (sortcode === "111111") return Promise.resolve(this.failValidation);

    return Promise.resolve(this.passValidation);
  }

  private verifyResult(accountDetails: IVerifyBankCheckInputs) {
    if (accountDetails.sortcode === "111111") return Promise.resolve(this.failVerify);

    return Promise.resolve(this.passVerify);
  }

  public validate = (sortcode: string, accountNumber: string) => this.validateResult(sortcode, accountNumber);
  public verify = (accountDetails: IVerifyBankCheckInputs) => this.verifyResult(accountDetails);
}
