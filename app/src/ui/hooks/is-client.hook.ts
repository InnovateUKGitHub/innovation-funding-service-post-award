import { useEffect, useState } from "react";

export function useIsClient() {
  const [canEditDom, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    setCanEdit(true);
  }, []);

  return canEditDom;
}
