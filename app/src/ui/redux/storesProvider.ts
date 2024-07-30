import { createContext, useContext } from "react";

export const createStores = () => ({});

export type IStores = ReturnType<typeof createStores>;

// initialised to null, will be set with stores when the Provider is instantiated
const storesContext = createContext<IStores>(null as unknown as IStores);

export const StoresProvider = storesContext.Provider;
/**
 * @deprecated Please use 'useStores' in favour of this HOC approach
 */
export const StoresConsumer = storesContext.Consumer;
export const useStores = () => useContext(storesContext);
