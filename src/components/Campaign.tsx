import { UserInfoContext } from "../context/userInfo";
import { useCampaign } from "../context/campaign";
import Party from "../components/Party";
import Schedule from "../components/Scheduling";
import CampaignHeader from "../components/CampaignHeader";

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useCloudQuery } from "freestyle-sh/react";

const Overview: React.FC = () => {
  return (
    <>
      <CampaignHeader />
      <Party />
      <Schedule />
    </>
  );
};

const CampaignComponent: React.FC = () => {
  const campaignInfo = useCampaign();
  let userInfo = null;

  if (campaignInfo.campaignLink !== null) {
    const { data: id } = useCloudQuery(campaignInfo.campaignLink.getId);
    const { data: name } = useCloudQuery(
      campaignInfo.campaignLink.getPlayerName,
    );
    const { data: characterName } = useCloudQuery(
      campaignInfo.campaignLink.getCharacterName,
    );
    const { data: linkType } = useCloudQuery(
      campaignInfo.campaignLink.getLinkType,
    );
    userInfo = {
      id,
      name,
      characterName,
      linkType,
    };
  }

  return (
    <UserInfoContext.Provider value={userInfo}>
      <Routes>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />} />
      </Routes>
    </UserInfoContext.Provider>
  );
};

export default CampaignComponent;
