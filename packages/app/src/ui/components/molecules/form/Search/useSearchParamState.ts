import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useSearchParamState = (key: string, def?: string): [string | null, (search: string | null) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const query = params.get(key);
  const [val, setVal] = useState<string | null>(def ?? query);

  const stubSetVal = (value: string | null) => {
    const params = new URLSearchParams(location.search);

    if (typeof value === "string") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const paramString = params.toString();

    let newLoc = location.pathname;
    if (paramString.length) {
      newLoc += "?";
      newLoc += paramString;
    }

    navigate(newLoc, { replace: true });
    setVal(value);
  };

  return [val, stubSetVal];
};

export { useSearchParamState };
