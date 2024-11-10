import { CampaignContext } from "../context/campaign";
import { CampaignLink, Campaign } from "../cloudstate/campaign";
import CampaignComponent from "../components/Campaign";

import React from "react";
import { useParams } from "react-router-dom";
import { useCloudQuery } from "freestyle-sh/react";
import { useCloud } from "freestyle-sh";

const CampaignPage: React.FC = () => {
  const { linkid } = useParams<{ linkid: string }>();
  const campaignLink = useCloud<typeof CampaignLink>(linkid!);
  const { data: campaignId } = useCloudQuery(campaignLink.getCampaignId);
  if (campaignId === undefined) {
    // TODO better loading
    return <div>Loading...</div>;
  }

  const campaign = useCloud<typeof Campaign>(campaignId);
  const campaignInfo = { campaignLink, campaign };

  return (
    <CampaignContext.Provider value={campaignInfo}>
      <div className="container">
        <CampaignComponent />
      </div>
    </CampaignContext.Provider>
  );
};

export default CampaignPage;
