import Dialog, { DialogProps } from "./Dialog";

import { useState } from "react";

interface PlayerEditDialogProps {
  characterName: string;
  playerName: string;
  isOpen: DialogProps["isOpen"];
  onClose?: DialogProps["onClose"];
  onSave: (playerName: string, characterName: string) => void;
}

/** A modal dialog. */
const PlayerEditDialog: React.FC<PlayerEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  characterName,
  playerName,
}) => {
  const [newPlayerName, setNewPlayerName] = useState(playerName);
  const [newCharacterName, setNewCharacterName] = useState(characterName);

  return (
    <Dialog
      title="Edit Player"
      isOpen={isOpen}
      onSave={() => onSave(newPlayerName, newCharacterName)}
      onClose={onClose}
    >
      <div>
        <label>
          Player Name:
          <input
            type="text"
            required
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Character Name:
          <input
            type="text"
            required
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
          />
        </label>
      </div>
    </Dialog>
  );
};

export default PlayerEditDialog;
