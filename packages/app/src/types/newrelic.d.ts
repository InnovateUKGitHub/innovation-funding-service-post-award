import NewRelic from "newrelic";

declare global {
  const newrelic: typeof NewRelic | null;
}
