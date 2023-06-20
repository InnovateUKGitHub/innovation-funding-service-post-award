import { useMounted } from "@ui/features/has-mounted/Mounted";
import { useQuery } from "relay-hooks";
import { OperationType } from "relay-runtime";

const useServerSideLoadedQuery = <TOperationType extends OperationType = OperationType>(
  ...props: Parameters<typeof useQuery>
): ReturnType<typeof useQuery> & { data: TOperationType["response"] } => {
  const { isClient } = useMounted();
  const output = useQuery<TOperationType>(...props);

  if (isClient && !output.data)
    throw new Error("A client GraphQL query was made without making the same server GraphQL query during SSR.");

  return output;
};

export { useServerSideLoadedQuery };
