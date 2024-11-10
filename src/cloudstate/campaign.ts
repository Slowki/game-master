import { CampaignLinkType } from "../data/campaign";
import { VoteType } from "../data/voting";

import { CloudState, cloudstate, invalidate, useCloud } from "freestyle-sh";

@cloudstate
export class TimeProposal {
  /** The unique identifier of the time proposal. */
  id = crypto.randomUUID();

  /** The proposed date/time. */
  date: string;

  /** A mapping from link ID to their vote. */
  votes: Record<string, VoteType>;

  constructor(date: Date) {
    this.date = date.toUTCString();
    this.votes = {};
  }

  getDate(): string {
    return this.date;
  }
}

/** A link to an external resource. */
@cloudstate
export class ResourceLink {
  /** The unique identifier of the time proposal. */
  id = crypto.randomUUID();

  /** The name of the link. */
  name: string;

  /** The URL of the resource. */
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
    invalidate(useCloud<typeof ResourceLink>(this.id).getName);
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
    invalidate(useCloud<typeof ResourceLink>(this.id).getUrl);
  }
}

@cloudstate
export class Campaign {
  /** The unique identifier of the campaign. */
  id = crypto.randomUUID();

  /** The name of the campaign. */
  name = "Unnamed Campaign";

  /** The description of the campaign. */
  description = "This campaign doesn't have a description yet.";

  /** The links to the campaign. */
  campaignLinks: CampaignLink[] = [];

  /** Links to external resources. */
  resourceLinks: ResourceLink[] = [];

  /** The time proposals for the campaign. */
  times: TimeProposal[] = [];

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
    invalidate(useCloud<typeof Campaign>(this.id).getName);
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
    invalidate(useCloud<typeof Campaign>(this.id).getDescription);
  }

  public getCampaignLinks(): CampaignLink[] {
    return this.campaignLinks;
  }

  public addCampaignLink(
    linkType: CampaignLinkType,
    playerName: string | null = null,
  ): CampaignLink {
    const campaignLink = new CampaignLink(this.id);
    campaignLink.linkType = linkType;
    if (playerName !== null) {
      campaignLink.playerName = playerName;
    }

    this.campaignLinks.push(campaignLink);
    invalidate(useCloud<typeof Campaign>(this.id).getCampaignLinks);
    return campaignLink;
  }

  public removeCampaignLink(id: string): void {
    this.campaignLinks = this.campaignLinks.filter((x) => x.id !== id);
    invalidate(useCloud<typeof Campaign>(this.id).getCampaignLinks);
  }

  public getResourceLinks(): ResourceLink[] {
    return this.resourceLinks;
  }

  public addResourceLink(name: string, url: string): ResourceLink {
    const campaignLink = new ResourceLink(name, url);
    this.resourceLinks.push(campaignLink);
    invalidate(useCloud<typeof Campaign>(this.id).getResourceLinks);
    return campaignLink;
  }

  public removeResourceLink(id: string): void {
    this.resourceLinks = this.resourceLinks.filter((x) => x.id !== id);
    invalidate(useCloud<typeof Campaign>(this.id).getResourceLinks);
  }

  public getTimeProposals(): TimeProposal[] {
    return this.times;
  }

  public addTimeProposal(date: Date): TimeProposal {
    const timeProposal = new TimeProposal(date);
    this.times.push(timeProposal);
    invalidate(useCloud<typeof Campaign>(this.id).getTimeProposals);
    return timeProposal;
  }

  public removeTimeProposal(id: string): void {
    this.times = this.times.filter((x) => x.id !== id);
    invalidate(useCloud<typeof Campaign>(this.id).getTimeProposals);
  }

  public voteForTimeProposal(id: string, userId: string, vote: VoteType): void {
    const proposal = this.times.find((x) => x.id === id);
    if (!proposal) {
      throw new Error("Time proposal not found");
    }

    proposal.votes[userId] = vote;
    invalidate(useCloud<typeof Campaign>(this.id).getTimeProposals);
  }
}

@cloudstate
export class CampaignLink {
  /** The unique identifier of the campaign link.*/
  id = crypto.randomUUID();

  /** The type of link.*/
  linkType: CampaignLinkType = CampaignLinkType.Player;

  /** The campaign that this link is for.*/
  campaignId: string;

  /** The name of the person. */
  playerName = "Unnamed Person";

  /** The name of their character. */
  characterName = "Unnamed Character";

  constructor(campaignId: string) {
    this.campaignId = campaignId;
  }

  public getId(): string {
    return this.id;
  }

  public getLinkType(): CampaignLinkType {
    return this.linkType;
  }

  public getCampaignId(): string {
    return this.campaignId;
  }

  public getPlayerName(): string {
    return this.playerName;
  }

  public setPersonName(playerName: string): void {
    this.playerName = playerName;
    invalidate(useCloud<typeof CampaignLink>(this.id).getPlayerName);
  }

  public getCharacterName(): string {
    return this.characterName;
  }

  public setCharacterName(characterName: string): void {
    this.characterName = characterName;
    invalidate(useCloud<typeof CampaignLink>(this.id).getCharacterName);
  }
}

/** Interface for a campaign and one of its links. */
export interface CampaignInterface {
  /** The campaign link. */
  campaignLink: CloudState<CampaignLink> | null;

  /** The campaign. */
  campaign: CloudState<Campaign>;
}

/** Class to track campaigns */
@cloudstate
export class CampaignManager {
  static id = "campaign-manager" as const;

  campaigns: Record<string, Campaign> = {};
  campaignLinks: Record<string, CampaignLink> = {};

  /** Create a new campaign and return the GM link for it. */
  public createCampaign(): CampaignLink {
    const campaign = new Campaign();
    this.campaigns[campaign.id] = campaign;

    const campaignLink = new CampaignLink(campaign.id);
    campaignLink.linkType = CampaignLinkType.GameMaster;
    campaignLink.playerName = "Game Master";
    campaign.campaignLinks.push(campaignLink);
    return campaignLink;
  }

  /** Find a campaign by ID. */
  public getCampaignById(id: string): Campaign | undefined {
    return this.campaigns[id];
  }
}
