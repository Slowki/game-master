export function dateToHuman(time: Date): string {
  const [day, date, timeOfDay] = time
    .toLocaleString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .split(",");
  return `${day} ${timeOfDay} on ${date}`;
}

/** Mapping from hour to the matching emoji. */
const timeToEmoji: Record<number, string> = {
  1: "🕐",
  2: "🕑",
  3: "🕒",
  4: "🕓",
  5: "🕔",
  6: "🕕",
  7: "🕖",
  8: "🕗",
  9: "🕘",
  10: "🕙",
  11: "🕚",
  12: "🕛",
};

/** Select the correct clock emoji for the given date.*/
export function dateToEmoji(time: Date): string {
  const hours = time.getHours();
  const hourIn12HrFormat = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  return timeToEmoji[hourIn12HrFormat];
}
