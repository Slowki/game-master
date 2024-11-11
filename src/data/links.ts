/** Create a player link.*/
export function playerLink(linkId: string) {
  return `${document.location.protocol}//${document.location.host}/player/${linkId}`;
}

/** Create a read-only campaign link.*/
export function campaignReadOnlyLink(campaignId: string) {
  return `${document.location.protocol}//${document.location.host}/campaign/${campaignId}`;
}
