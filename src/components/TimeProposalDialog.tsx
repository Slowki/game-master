import Dialog, { DialogProps } from "./Dialog";
import { dateToHuman } from "../data/date";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { useState } from "react";

interface TimeProposalDialogProps {
  time: Date;
  isOpen: DialogProps["isOpen"];
  onClose?: DialogProps["onClose"];
  onSave: (time: Date) => void;
}

/** A modal dialog. */
const TimeProposalDialog: React.FC<TimeProposalDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  time,
}) => {
  const [newDate, setNewDate] = useState(time);

  return (
    <Dialog
      title="Propose Time"
      isOpen={isOpen}
      onSave={() => onSave(newDate)}
      onClose={onClose}
    >
      <h2>Demo Calendar</h2>
      <DateTimePicker
        minDate={new Date()}
        maxDetail="minute"
        onChange={(x) => {
          if (x) {
            setNewDate(x);
          }
        }}
        value={newDate}
      />
      <p>Selected: {dateToHuman(newDate)}</p>
    </Dialog>
  );
};

export default TimeProposalDialog;
