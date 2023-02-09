import { Field, ObjectType } from "type-graphql";

abstract class SalesforceFieldValueObject {
  @Field(() => String)
  displayValue!: string;
}

abstract class SalesforceLabelledFieldValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  label!: string;
}

abstract class SalesforceFormattedFieldValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  format!: string;
}

@ObjectType()
class SalesforceBase64ValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceBooleanValueObject extends SalesforceFieldValueObject {
  @Field(() => Boolean)
  value!: boolean;
}

@ObjectType()
class SalesforceCurrencyValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Number)
  value!: number;
}

@ObjectType()
class SalesforceDateTimeValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Date)
  value!: Date;
}

@ObjectType()
class SalesforceDateValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Date)
  value!: Date;
}

@ObjectType()
class SalesforceDoubleValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Number)
  value!: number;
}

@ObjectType()
class SalesforceEmailValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceEncryptedStringValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceIdValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceIntValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Number)
  value!: number;
}

@ObjectType()
class SalesforceLongTextAreaValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceLongValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Number)
  value!: number;
}

@ObjectType()
class SalesforceMultiPicklistValueObject extends SalesforceLabelledFieldValueObject {
  @Field(() => String)
  value!: number;
}

@ObjectType()
class SalesforceStringValueObject extends SalesforceFieldValueObject {
  @Field(() => String)
  value!: string;
}

@ObjectType()
class SalesforceNumberValueObject extends SalesforceFormattedFieldValueObject {
  @Field(() => Number)
  value!: number;
}

export {
  SalesforceStringValueObject,
  SalesforceBase64ValueObject,
  SalesforceBooleanValueObject,
  SalesforceCurrencyValueObject,
  SalesforceDateTimeValueObject,
  SalesforceDateValueObject,
  SalesforceDoubleValueObject,
  SalesforceEmailValueObject,
  SalesforceEncryptedStringValueObject,
  SalesforceFieldValueObject,
  SalesforceFormattedFieldValueObject,
  SalesforceIdValueObject,
  SalesforceIntValueObject,
  SalesforceLabelledFieldValueObject,
  SalesforceLongTextAreaValueObject,
  SalesforceLongValueObject,
  SalesforceMultiPicklistValueObject,
  SalesforceNumberValueObject,
};
