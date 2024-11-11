import { TimeProposal } from "../cloudstate/campaign";
import Section from "../components/Section";
import { useCampaign } from "../context/campaign";
import { useUserInfo, useUserIsGM } from "../context/userInfo";
import HeaderButton from "./HeaderButton";
import { dateToHuman, dateToEmoji } from "../data/date";

import React, { lazy, Suspense, useState } from "react";
import { useCloudQuery } from "freestyle-sh/react";
import { rankedChoiceVote, VoteType } from "../data/voting";

const TimeProposalDialog = lazy(() => import("./TimeProposalDialog"));

const ProposeTime = () => {
  const userIsGM = useUserIsGM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const campaignInfo = useCampaign();

  if (!userIsGM) return null;

  const handleSave = async (time: Date) => {
    // @ts-expect-error This is just a type system bug
    await campaignInfo.campaign.addTimeProposal(time);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimeProposalDialog
        isOpen={isModalOpen}
        time={new Date()}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
      <HeaderButton onClick={() => setIsModalOpen(true)}>
        + Add Proposed Time
      </HeaderButton>
    </Suspense>
  );
};

const VoteButton: React.FC<{
  currentVote: VoteType | null;
  vote: VoteType;
  updoots: number;
  onClick: (vote: VoteType) => void;
}> = ({ currentVote, vote, updoots, onClick }) => {
  const voteText = {
    [VoteType.Cant]: "👎",
    [VoteType.First]: "1st",
    [VoteType.Second]: "2nd",
    [VoteType.Third]: "3rd",
  }[vote];

  return (
    <button
      onClick={() => onClick(vote)}
      className={vote === currentVote ? "active-vote" : ""}
    >
      {voteText} ({updoots})
    </button>
  );
};

function collectVotes(votes: Record<string, VoteType>): Map<VoteType, number> {
  const collectedVotes = new Map([
    [VoteType.First, 0],
    [VoteType.Second, 0],
    [VoteType.Third, 0],
    [VoteType.Cant, 0],
  ]);

  for (const key of Object.values(votes)) {
    collectedVotes.set(key, (collectedVotes.get(key) || 0) + 1);
  }

  return collectedVotes;
}

const ScheduleItem: React.FC<{
  time: Date;
  winning: boolean;
  votes: Map<VoteType, number>;
  proposal: TimeProposal;
}> = ({ time, winning, votes, proposal }) => {
  const userInfo = useUserInfo();
  const campaign = useCampaign();
  const userIsGM = useUserIsGM();

  const userVote = userInfo ? proposal.votes[userInfo.id!] : null;

  const handleDelete = async () => {
    await campaign.campaign.removeTimeProposal(proposal.id);
  };

  const updateVote = async (vote: VoteType) => {
    if (!userInfo) return;
    if (userVote === vote) {
      await campaign.campaign.unvoteForTimeProposal(proposal.id, userInfo.id!);
    } else {
      await campaign.campaign.voteForTimeProposal(
        proposal.id,
        userInfo.id!,
        vote,
      );
    }
  };

  return (
    <div className={`card schedule-item row ${winning ? "winning-vote" : ""}`}>
      <p className="schedule-time">
        {dateToEmoji(time)} {dateToHuman(time)}
      </p>
      <div className="row">
        {Array.from(votes.entries()).map(([vote, count]) => (
          <VoteButton
            key={vote}
            currentVote={userVote}
            vote={vote}
            updoots={count}
            onClick={updateVote}
          />
        ))}
        {userIsGM && <button onClick={handleDelete}>X</button>}
      </div>
    </div>
  );
};

const Schedule = () => {
  const campaignInfo = useCampaign();
  const { data: times } = useCloudQuery(campaignInfo.campaign.getTimeProposals);

  let content: React.ReactNode = null;
  if (times === undefined) {
    content = <div>Loading proposed times</div>;
  } else {
    const timeRecords = times
      .map((proposal) => ({
        proposal,
        votes: collectVotes(proposal.votes),
        time: new Date(Date.parse(proposal.date)),
      }))
      .sort((a, b) => (a.time > b.time ? -1 : 1));

    const winningTime = rankedChoiceVote<Date>(
      timeRecords.map(({ votes, time }) => ({
        value: time,
        votes: votes,
      })),
    );

    content = timeRecords.map(({ proposal, votes, time }, index) => (
      <ScheduleItem
        winning={time === winningTime}
        key={index}
        time={time}
        votes={votes}
        proposal={proposal}
      />
    ));
  }

  return (
    <Section name="Proposed Game Times" headerElements={<ProposeTime />}>
      <span className="muted">
        Ranked choice voting for the next game session. Select your top 3
        available times and 👎 any times that don't work for you.
      </span>
      {content}
    </Section>
  );
};

export default Schedule;
