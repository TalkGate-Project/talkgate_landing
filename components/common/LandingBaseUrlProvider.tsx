"use client";

import { createContext, useContext } from "react";

const LandingBaseUrlContext = createContext<string | undefined>(undefined);

export function LandingBaseUrlProvider({
  landingBaseUrl,
  children,
}: {
  landingBaseUrl: string;
  children: React.ReactNode;
}) {
  return (
    <LandingBaseUrlContext.Provider value={landingBaseUrl}>
      {children}
    </LandingBaseUrlContext.Provider>
  );
}

export function useLandingBaseUrl(): string | undefined {
  return useContext(LandingBaseUrlContext);
}
