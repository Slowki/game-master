import { CampaignLinkType } from "../data/campaign";

import { createContext, useContext } from "react";

export interface UserInfoContextType {
  /** The link ID for this user. */
  id: string | null;
  /** The user's name. */
  name: string | null;
  /** The name of the user's character. */
  characterName: string | null;
  /** The user's role. */
  linkType: CampaignLinkType | null;
}

export const UserInfoContext = createContext<
  UserInfoContextType | null | undefined
>(undefined);

export const useUserInfo = (): UserInfoContextType | null => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};

export const useUserIsGM = (): boolean => {
  const userInfo = useUserInfo();
  return userInfo !== null && userInfo.linkType === CampaignLinkType.GameMaster;
};
