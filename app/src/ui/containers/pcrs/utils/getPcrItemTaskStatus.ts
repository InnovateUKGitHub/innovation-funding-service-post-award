import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { TaskStatus } from "@ui/components/taskList";

export const getPcrItemTaskStatus = (status: PCRItemStatus): TaskStatus => {
  switch (status) {
    case PCRItemStatus.Complete:
      return "Complete";

    case PCRItemStatus.Incomplete:
      return "Incomplete";

    case PCRItemStatus.ToDo:
    default:
      return "To do";
  }
};
