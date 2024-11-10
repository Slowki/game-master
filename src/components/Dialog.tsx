export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
}

/** A modal dialog. */
const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
}) => {
  return (
    <dialog open={isOpen}>
      <div className="island">
        <h2>{title}</h2>
        {children}
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onSave();
              if (onClose != null) {
                onClose();
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
