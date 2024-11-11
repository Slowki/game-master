import { CampaignContext } from "../context/campaign";
import { Campaign } from "../cloudstate/campaign";
import CampaignComponent from "../components/Campaign";
import BottomBarLazy from "../components/BottomBarLazy";

import React from "react";
import { useParams } from "react-router-dom";
import { useCloud } from "freestyle-sh";

const CampaignPage: React.FC = () => {
  const { linkid } = useParams<{ linkid: string }>();
  if (!linkid) {
    return <div>Invalid campaign link</div>;
  }

  const campaign = useCloud<typeof Campaign>(linkid);
  const campaignInfo = { campaignLink: null, campaign };

  return (
    <CampaignContext.Provider value={campaignInfo}>
      <div className="container">
        <CampaignComponent />
      </div>
      <BottomBarLazy />
    </CampaignContext.Provider>
  );
};

export default CampaignPage;
