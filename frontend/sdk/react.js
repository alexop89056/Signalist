"use client";

import { createContext, useContext, useEffect } from "react";

const SignalistContext = createContext(null);

export function SignalistProvider({ siteId, endpoint = "http://localhost:8080/api/v1/events", children }) {
  const track = (name, properties = {}) => fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ siteId, type: "event", path: window.location.pathname, properties: { name, ...properties }, timestamp: new Date().toISOString() })
  });

  useEffect(() => { track("pageview"); }, []);
  return <SignalistContext.Provider value={track}>{children}</SignalistContext.Provider>;
}

export function useTrackEvent() {
  const track = useContext(SignalistContext);
  if (!track) throw new Error("useTrackEvent must be used inside SignalistProvider");
  return track;
}
