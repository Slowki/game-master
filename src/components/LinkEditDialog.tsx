import Dialog, { DialogProps } from "./Dialog";

import { useState } from "react";

interface LinkEditDialogProps {
  isOpen: DialogProps["isOpen"];
  onClose?: DialogProps["onClose"];
  onSave: (linkName: string, url: string) => void;
}

/** A modal dialog. */
const LinkEditDialog: React.FC<LinkEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  return (
    <Dialog
      title="Edit Link"
      isOpen={isOpen}
      onSave={() => onSave(newLinkName, newLinkUrl)}
      onClose={onClose}
    >
      <div>
        <label>
          Link Name:
          <input
            type="text"
            required
            placeholder="Link Name"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          URL:
          <input
            type="text"
            placeholder="URL"
            required
            pattern="https?://.*"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
          />
        </label>
      </div>
    </Dialog>
  );
};

export default LinkEditDialog;
