import { CampaignLink } from "../cloudstate/campaign";
import Section from "../components/Section";
import { useCampaign } from "../context/campaign";
import { useUserInfo, useUserIsGM } from "../context/userInfo";
import { CampaignLinkType } from "../data/campaign";
import HeaderButton from "./HeaderButton";
import PlayerEditDialog from "./PlayerEditDialog";
import { playerLink } from "../data/links";

import { useCloudQuery } from "freestyle-sh/react";
import { useState } from "react";
import { useCloud } from "freestyle-sh";

const PartyMemberEditor = ({ link }: { link: CampaignLink }) => {
  const cloudLink = useCloud<typeof CampaignLink>(link.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          if (navigator.share) {
            navigator.share({
              title: "Campaign Link",
              url: playerLink(link.id),
            });
          } else {
            navigator.clipboard.writeText(playerLink(link.id));
          }
          e.stopPropagation();
        }}
      >
        🔗
      </button>
      <button onClick={() => setIsModalOpen(true)}>✏️</button>
      <PlayerEditDialog
        isOpen={isModalOpen}
        onSave={async (playerName: string, characterName: string) => {
          await cloudLink.setPersonName(playerName);
          await cloudLink.setCharacterName(characterName);
        }}
        onClose={() => setIsModalOpen(false)}
        characterName={link.characterName}
        playerName={link.playerName}
      />
    </>
  );
};

const PartyMember = ({ link }: { link: CampaignLink }) => {
  const cloudLink = useCloud<typeof CampaignLink>(link.id);
  const campaignInfo = useCampaign();
  const userInfo = useUserInfo();
  const userIsGM = useUserIsGM();
  const linkIsUser = link.id === userInfo?.id;
  const { data: characterName } = useCloudQuery(cloudLink.getCharacterName);
  const { data: playerName } = useCloudQuery(cloudLink.getPlayerName);

  const emoji = link.linkType === CampaignLinkType.GameMaster ? "🎲" : "🧙";

  let editorButton = null;
  let deleteButton = null;

  // Allow GMs and the user to edit their own details
  if (userIsGM || linkIsUser) {
    editorButton = <PartyMemberEditor link={link} />;
  }

  // Allow GMs to delete other players
  if (userIsGM && !linkIsUser) {
    const deleteUser = async () => {
      // Logic to add a party member
      if (confirm(`Are you sure you want to delete ${characterName}?`)) {
        await campaignInfo.campaign.removeCampaignLink(link.id);
      }
    };

    deleteButton = <button onClick={deleteUser}>X</button>;
  }

  return (
    <div className="row card party-member">
      <div className="flex align-center">{emoji}</div>
      <div className="column" style={{ flex: "1 1", justifyContent: "left" }}>
        <div className="flex">
          <b>{characterName}</b>
        </div>
        <div className="flex muted">{playerName}</div>
      </div>
      <div className="row">
        {editorButton} {deleteButton}
      </div>
    </div>
  );
};

const AddPartyMember = () => {
  const userIsGM = useUserIsGM();
  const campaignInfo = useCampaign();

  if (!userIsGM) return null;

  const handleAddMember = async () => {
    // Logic to add a party member
    await campaignInfo.campaign.addCampaignLink(
      CampaignLinkType.Player,
      "New Party Member",
    );
  };

  return <HeaderButton onClick={handleAddMember}>+ Add Member</HeaderButton>;
};

function sortLinks(a: CampaignLink, b: CampaignLink) {
  // Then sort by name
  if (a.playerName < b.playerName) {
    return -1;
  }
  if (a.playerName > b.playerName) {
    return 1;
  }
  return 0;
}

const ExportToCSV = ({ links }: { links: CampaignLink[] }) => {
  const exportToCSV = () => {
    const csvContent = [
      ["Character Name", "Player Name", "Initiative"],
      ...links.map((link) => [link.characterName, link.playerName, ""]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "party_members.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <HeaderButton onClick={exportToCSV}>⬇︎ CSV</HeaderButton>;
};

const PartyMemberList = () => {
  const campaignInfo = useCampaign();
  const { data: campaignLinks } = useCloudQuery(
    campaignInfo.campaign.getCampaignLinks,
  );

  let content = null;

  let exportButton = null;
  if (campaignLinks === undefined) {
    // TODO better loading state
    content = <div>Loading party members</div>;
  } else {
    const links = campaignLinks
      .slice()
      .filter((x) => x.linkType !== CampaignLinkType.GameMaster)
      .sort(sortLinks);
    exportButton = <ExportToCSV links={links} />;

    content = (
      <div className="members-list">
        {links.map((link) => (
          <PartyMember key={link.id} link={link} />
        ))}
      </div>
    );
  }

  return (
    <Section
      name="Party Members"
      headerElements={
        <div className="row">
          <AddPartyMember />
          {exportButton}
        </div>
      }
    >
      {content}
    </Section>
  );
};

export default PartyMemberList;
