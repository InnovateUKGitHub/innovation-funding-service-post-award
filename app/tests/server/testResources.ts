import { IResources } from "@framework/types/IContext";
import { ICompaniesHouse } from "@server/resources/companiesHouse";
import { IBankCheckService } from "@server/resources/bankCheckService";
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

class TestBankCheckService implements IBankCheckService {
  private readonly conditions: BankCheckCondition = {
    severity: "warning",
    code: 2,
    description: "description"
  };

  private readonly validateResult = {
    ValidationResult: {
      checkPassed: true,
      iban: "123456",
      conditions: this.conditions
    }
  };
  private readonly verifyResult = {
    VerificationResult: {
      addressScore: null,
      companyNameScore: null,
      personalDetailsScore: null,
      regNumberScore: null,
      conditions: this.conditions,
    }
  };
  public validate = () => Promise.resolve(this.validateResult);
  public verify = () => Promise.resolve(this.verifyResult);
}
