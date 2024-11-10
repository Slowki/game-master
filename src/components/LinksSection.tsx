import { useCampaign } from "../context/campaign";
import { useUserIsGM } from "../context/userInfo";
import HeaderButton from "./HeaderButton";
import { ResourceLink } from "../cloudstate/campaign";
import LinkEditDialog from "./LinkEditDialog";

import { useCloudQuery } from "freestyle-sh/react";
import { useState } from "react";
import { useCloud } from "freestyle-sh";

function getImageForLink(url: string) {
  if (url.startsWith("https://docs.google.com/document/")) {
    return "📄";
  } else if (url.startsWith("https://docs.google.com/spreadsheets/")) {
    return "🧮";
  }
  return "🔗";
}

export const LinkAddButton: React.FC = () => {
  const campaignInfo = useCampaign();
  const userIsGM = useUserIsGM();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!userIsGM) return null;

  return (
    <>
      <LinkEditDialog
        isOpen={isModalOpen}
        onSave={async (name: string, url: string) => {
          await campaignInfo.campaign.addResourceLink(name, url);
        }}
        onClose={() => setIsModalOpen(false)}
      />

      <HeaderButton onClick={() => setIsModalOpen(true)}>
        + Add Link
      </HeaderButton>
    </>
  );
};

const Link: React.FC<{ link: ResourceLink }> = ({ link }) => {
  const campaignInfo = useCampaign();
  const cloudLink = useCloud<typeof ResourceLink>(link.id);
  const { data: url } = useCloudQuery(cloudLink.getUrl);
  const { data: name } = useCloudQuery(cloudLink.getName);
  const emoji = getImageForLink(url || "");
  const deleteButton = useUserIsGM() ? (
    <button
      style={{ marginLeft: "5px" }}
      onClick={async () =>
        await campaignInfo.campaign.removeResourceLink(link.id)
      }
    >
      X
    </button>
  ) : null;

  return (
    <div className="row resource-link">
      <a href={url} className="row" target="_blank" rel="noopener noreferrer">
        <div>{emoji}</div> <div>{name}</div>
      </a>
      {deleteButton}
    </div>
  );
};

const LinksSection: React.FC = () => {
  const campaignInfo = useCampaign();
  const { data: links } = useCloudQuery(campaignInfo.campaign.getResourceLinks);

  return (
    <div className="row resource-links">
      {(links || []).map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  );
};

export default LinksSection;
