interface SffFieldBase {
  sfdcName: Readonly<string>;
  // sffName: Readonly<string>;
  sfdcType: Readonly<SffFieldType>;
}
interface SffRelationship {
  sfdcName: Readonly<string>;
  sffBuilder: SffBuilder<any>;
}

enum SffFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SINGLE_PICKLIST = "SINGLE_PICKLIST",
  MULTI_PICKLIST = "MULTI_PICKLIST",
  CHECKBOX = "CHECKBOX",
  DATETIME = "DATETIME",
}

interface SffFieldTypeToJsMap {
  [SffFieldType.STRING]: string;
  [SffFieldType.NUMBER]: number;
  [SffFieldType.SINGLE_PICKLIST]: string;
  [SffFieldType.MULTI_PICKLIST]: string[];
  [SffFieldType.CHECKBOX]: boolean;
  [SffFieldType.DATETIME]: Date;
}

type SffTypeToJsType<T extends SffFieldType> = SffFieldTypeToJsMap[T];

interface SffStringField extends SffFieldBase {
  sfdcType: SffFieldType.STRING;
}
interface SffNumberField extends SffFieldBase {
  sfdcType: SffFieldType.NUMBER;
}
interface SffPicklistField extends SffFieldBase {
  sfdcType: SffFieldType.SINGLE_PICKLIST;
}
interface SffCheckboxField extends SffFieldBase {
  sfdcType: SffFieldType.CHECKBOX;
}
interface SffDateTimeField extends SffFieldBase {
  sfdcType: SffFieldType.DATETIME;
}

type SffField = SffStringField | SffNumberField | SffPicklistField | SffCheckboxField | SffDateTimeField;

interface SffFactoryObjectDefinition {
  sfdcName: Readonly<string>;
  fields: ReadonlyArray<SffField>;
  relationships: ReadonlyArray<SffRelationship>;
}

class SffBuilder<T extends SffFactoryObjectDefinition> {
  private readonly definition: T;
  private readonly fields: Map<T["fields"][number]["sfdcName"], any>;
  private readonly relationships;

  constructor({ definition, fields }: { definition: Readonly<T>; fields?: Map<T["fields"][number]["sfdcName"], any> }) {
    this.definition = definition;
    this.fields = new Map(fields);
  }

  setField<Key extends T["fields"][number]["sfdcName"], Row extends { sfdcName: Key } & T["fields"][number]>(
    sfdcName: Key,
    value: SffTypeToJsType<Row["sfdcType"]>,
  ) {
    // const field = this.definition.fields.find(x => x.sfdcName === sfdcName)! as Row;
    this.fields.set(sfdcName, value);
    return this;
  }

  copy() {
    return new SffBuilder<T>({ definition: this.definition, fields: this.fields });
  }
}

const contact = new SffBuilder(<const>{
  definition: {
    sfdcName: "Acc_Contact__c",
    fields: [{ sfdcName: "Title", sfdcType: SffFieldType.STRING }],
    relationships: [],
  },
});

const project = new SffBuilder(<const>{
  definition: {
    sfdcName: "Acc_Project__c",
    fields: [
      { sfdcName: "Acc_ProjectNumber__c", sfdcType: SffFieldType.STRING },
      { sfdcName: "Acc_StartDate__c", sfdcType: SffFieldType.DATETIME },
    ],
    relationships: [{ sfdcName: "Acc_Contact__r", sffBuilder: contact }],
  },
});

const projectA = project.setField("Acc_ProjectNumber__c", "hello").setField("Acc_StartDate__c", new Date());
const projectB = projectA.copy().setField("Acc_ProjectNumber__c", "world");

abstract class SffObject {
  create() {}
  delete() {}
}
