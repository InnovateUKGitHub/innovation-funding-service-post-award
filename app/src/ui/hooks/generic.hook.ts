import React, { useEffect, useRef } from "react";

export const useDidUpdate = (cb: React.EffectCallback, deps?: React.DependencyList | undefined) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      cb();
    }
  }, deps);
};
