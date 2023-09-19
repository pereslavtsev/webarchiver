import { FC } from "react";
import { NonIdealState } from "@blueprintjs/core";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage: FC = () => {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return <NonIdealState icon="error" title={error.status} description={error.statusText} />
  }
  if (error instanceof Error) {
    return <NonIdealState icon="error" title={error.name} description={error.message} />
  }
  return null;
}

export default ErrorPage;
