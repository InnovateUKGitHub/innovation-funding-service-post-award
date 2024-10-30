import React, { useEffect, useRef } from "react";

/**
 * **useDidUpdate**
 *
 * Generic hook will not call the callback on initial mount, but will call on all
 * subsequent updates controlled by updates in the dependency array, as per `useEffect`.
 *
 * Hook mimics the behaviour of combined `componentDidUpdate` and `shouldComponentUpdate` in class-based components
 */
export function useDidUpdate(cb: React.EffectCallback, deps?: React.DependencyList | undefined) {
  const mounted = useRef(false);

  useEffect(function () {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      cb();
    }
  }, deps);
}

/**
 * **useDidMount**
 *
 * Generic hook will call the callback only on initial mount, and not thereafter.
 *
 * Hook mimics the behaviour of `componentDidMount` in class-based components.
 */
export function useDidMount(cb: React.EffectCallback) {
  useEffect(function () {
    cb();
  }, []);
}
