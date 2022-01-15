import { getPending } from "@ui/helpers/get-pending";
import { useStores } from "@ui/redux";
import { createContext, useContext } from "react";

interface IProjectParticipants {
  totalParticipants: number;
  isSingleParticipant: boolean;
  isMultipleParticipants: boolean;
}

const projectParticipantsContext = createContext<IProjectParticipants | undefined>(undefined);

const initialProjectStatusState: IProjectParticipants = {
  totalParticipants: -1,
  isSingleParticipant: false,
  isMultipleParticipants: false,
};

function useGetProjectParticipants(projectId?: string): IProjectParticipants {
  const stores = useStores();

  // Note: Bail from non-project pages
  if (!projectId) return initialProjectStatusState;

  const partnersPending = stores.partners.getPartnersForProject(projectId);
  const { isLoading, isRejected, error, payload } = getPending(partnersPending);

  if (isRejected) throw Error(error?.message ?? "There was an error fetching data within useGetProjectParticipants");

  if (!payload || isLoading) return initialProjectStatusState;

  const totalParticipants = payload.length;
  const isSingleParticipant = totalParticipants === 1;
  const isMultipleParticipants = totalParticipants > 1;

  return {
    totalParticipants,
    isSingleParticipant,
    isMultipleParticipants,
  };
}

interface ProjectParticipantProviderProps {
  projectId: string | undefined;
  children: React.ReactElement;
}

export function ProjectParticipantProvider({ projectId, ...props }: ProjectParticipantProviderProps) {
  const state = useGetProjectParticipants(projectId);

  return <projectParticipantsContext.Provider {...props} value={state} />;
}

export function useProjectParticipants(): IProjectParticipants {
  const context = useContext(projectParticipantsContext);

  if (!context) throw Error("'ProjectParticipantProvider' is missing for this hook to work.");

  return context;
}

/**
 * @deprecated This needs to be replaced with the direct usage of hook useProjectParticipants()
 */
export function ProjectParticipantsHoc(props: {
  children: (state: IProjectParticipants) => JSX.Element | null | false;
}) {
  const state = useProjectParticipants();
  return props.children(state) || null;
}
