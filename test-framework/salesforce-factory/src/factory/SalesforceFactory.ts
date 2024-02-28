interface SffFieldBase {
  sfdcName: Readonly<string>;
  sffName: Readonly<string>;
  sfdcType: Readonly<SffFieldType>;
}

enum SffFieldType {
  STRING,
  NUMBER,
  SINGLE_PICKLIST,
  MULTI_PICKLIST,
  CHECKBOX,
}

interface SffFieldTypeToJsMap {
  [SffFieldType.STRING]: string;
  [SffFieldType.NUMBER]: number;
  [SffFieldType.SINGLE_PICKLIST]: string;
  [SffFieldType.MULTI_PICKLIST]: string[];
  [SffFieldType.CHECKBOX]: boolean;
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

type SffField = SffStringField | SffNumberField | SffPicklistField | SffCheckboxField;

interface SffRelationship {
  sfdcName: Readonly<string>;
  sffName: Readonly<string>;
}

interface SffFactoryObjectDefinition {
  sfdcName: Readonly<string>;
  fields: ReadonlyArray<SffField>;
  relationships: ReadonlyArray<SffRelationship>;
}

class SffBuilder<T extends Readonly<SffFactoryObjectDefinition>> {
  private readonly definition: Readonly<T>;

  constructor({ definition }: { definition: Readonly<T> }) {
    this.definition = definition;
  }

  setField<HAHA extends T["fields"][number]>(sffName: HAHA["sffName"], value: SffTypeToJsType<HAHA["sfdcType"]>) {
    const sfdcName: SffField = this.definition.fields.find(x => x.sffName === sffName)!;

    return this;
  }
}

const project = new SffBuilder(<const>{
  definition: {
    sfdcName: "Acc_Project__c",
    fields: [
      { sfdcName: "Acc_ProjectNumber__c", sffName: "projectNumber", sfdcType: SffFieldType.STRING },
      { sfdcName: "Acc_SomethingElse__c", sffName: "number", sfdcType: SffFieldType.NUMBER },
    ],
    relationships: [],
  },
});

project.setField("projectNumber", 34438724).setField("number", "jkjkhasdhads");

abstract class SffObject {
  create() {}
  delete() {}
}
