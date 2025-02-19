import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useExistingSearchParams = () => {
  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  return params;
};

export { useExistingSearchParams };
