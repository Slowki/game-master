import { useUserIsGM } from "../context/userInfo";
import { useCampaign } from "../context/campaign";
import Section from "../components/Section";
import CampaignEditDialog from "../components/CampaignEditor";
import LinksSection, { LinkAddButton } from "./LinksSection";
import HeaderButton from "./HeaderButton";
import { campaignReadOnlyLink } from "../data/links";

import React, { useState } from "react";
import { useCloudQuery } from "freestyle-sh/react";

function copyLinkToClipboard(campaignId: string) {
  const url = campaignReadOnlyLink(campaignId);
  if (navigator.share) {
    navigator.share({
      title: "Campaign Read-Only Link",
      url: url,
    });
  } else {
    navigator.clipboard.writeText(url);
  }
}

const CampaignHeader: React.FC = () => {
  const campaignInfo = useCampaign();
  const userIsGM = useUserIsGM();
  const { data: campaignName } = useCloudQuery(campaignInfo.campaign.getName);
  const { data: campaignId } = useCloudQuery(campaignInfo.campaign.getId);
  const { data: campaignDescription } = useCloudQuery(
    campaignInfo.campaign.getDescription,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  let headerContent = null;
  if (userIsGM) {
    headerContent = (
      <>
        <LinkAddButton />
        <CampaignEditDialog
          isOpen={isModalOpen}
          onSave={async (campaignName: string, campaignDescription: string) => {
            await campaignInfo.campaign.setName(campaignName);
            await campaignInfo.campaign.setDescription(campaignDescription);
          }}
          onClose={() => setIsModalOpen(false)}
          campaignName={campaignName}
          campaignDescription={campaignDescription}
        />
        <HeaderButton onClick={() => setIsModalOpen(true)}>✏️</HeaderButton>
      </>
    );
  }

  return (
    <Section
      name={campaignName}
      headerElements={
        <div className="row">
          <HeaderButton onClick={() => copyLinkToClipboard(campaignId)}>
            View Only 🔗
          </HeaderButton>
          {headerContent}
        </div>
      }
    >
      <LinksSection />
      <p className="muted">{campaignDescription}</p>
    </Section>
  );
};

export default CampaignHeader;
