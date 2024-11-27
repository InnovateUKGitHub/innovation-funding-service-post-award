import { RecordType } from "../sobjects/RecordType";

const getRecordType = ({
  recordTypes,
  developerName,
  sobject,
}: {
  recordTypes: RecordType[];
  developerName: string;
  sobject: string;
}) => {
  const type = recordTypes.find(x => x.DeveloperName === developerName && x.SobjectType === sobject);
  if (!type) throw new Error(`Could not find record type ${developerName} of type ${sobject}.`);
  return type;
};

export { getRecordType };
