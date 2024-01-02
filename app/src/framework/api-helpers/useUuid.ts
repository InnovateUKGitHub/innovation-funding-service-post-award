import { useState } from "react";
import { v4 as generateUuid } from "uuid";

const useUuid = () => {
  const [uuid, setUuid] = useState<string>(generateUuid());

  const newUuid = () => {
    setUuid(generateUuid());
  };

  return { uuid, newUuid };
};

export { useUuid };
