import { ClientErrorResponse } from "@framework/util/errorHandlers";

const ErrorStacktrace = ({ stack, cause }: Pick<ClientErrorResponse, "stack" | "cause">) => {
  return (
    <div className="ifspa-developer-stacktrace">
      <pre className="ifspa-developer-stacktrace-stack">{stack}</pre>
      {cause && <ErrorStacktrace stack={cause.stack} cause={cause.cause} />}
    </div>
  );
};

export { ErrorStacktrace };
