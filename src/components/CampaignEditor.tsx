import Dialog, { DialogProps } from "./Dialog";

import { useState } from "react";

interface CampaignEditDialogProps {
  campaignDescription: string;
  campaignName: string;
  isOpen: DialogProps["isOpen"];
  onClose?: DialogProps["onClose"];
  onSave: (campaignName: string, campaignDescription: string) => void;
}

/** A modal dialog. */
const CampaignEditDialog: React.FC<CampaignEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  campaignDescription,
  campaignName,
}) => {
  const [newCampaignName, setNewCampaignName] = useState(campaignName);
  const [newCampaignDescription, setNewCampaignDescription] =
    useState(campaignDescription);

  return (
    <Dialog
      title="Edit Campaign"
      isOpen={isOpen}
      onSave={() => onSave(newCampaignName, newCampaignDescription)}
      onClose={onClose}
    >
      <div>
        <label>
          Campaign Name:
          <input
            type="text"
            defaultValue={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value.trim())}
          />
        </label>
      </div>
      <div>
        <label>
          Campaign Description:
          <textarea
            defaultValue={newCampaignDescription}
            onChange={(e) => setNewCampaignDescription(e.target.value.trim())}
          />
        </label>
      </div>
    </Dialog>
  );
};

export default CampaignEditDialog;
