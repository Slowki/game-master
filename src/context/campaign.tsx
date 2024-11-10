import { CampaignInterface } from "../cloudstate/campaign";

import { createContext, useContext } from "react";

export const CampaignContext = createContext<CampaignInterface | undefined>(
  undefined,
);

export const useCampaign = (): CampaignInterface => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignContext");
  }
  return context;
};
