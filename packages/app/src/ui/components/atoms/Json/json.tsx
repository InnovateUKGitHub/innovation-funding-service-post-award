interface JsonProps {
  value: unknown;
}

export const Json: React.FunctionComponent<JsonProps> = ({ value }: JsonProps) => {
  return <pre>{JSON.stringify(value, null, 5)}</pre>;
};
