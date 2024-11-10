export enum VoteType {
  Cant = 0,
  First = 1,
  Second = 2,
  Third = 3,
}

interface Choice<T> {
  value: T;
  votes: Map<VoteType, number>;
}

function voteToScore(vote: VoteType): number {
  switch (vote) {
    case VoteType.First:
      return 10;
    case VoteType.Second:
      return 7;
    case VoteType.Third:
      return 5;
    case VoteType.Cant:
      return -100;
  }
}

/** Select the best option based on the votes it has received.
    @param options A mapping from option to the votes it has received.
    @returns The option that wins the ranked choice voting.
*/
export function rankedChoiceVote<T>(options: Choice<T>[]): T | null {
  // Filter out options with no votes and those marked as "can't"
  options = options
    .filter((x) => !Array.from(x.votes.values()).every((x) => x == 0))
    .filter((x) => x.votes.get(VoteType.Cant) == 0);

  if (options.length === 0) {
    return null;
  }

  let choice = options[0].value;
  let maxScore = -1;
  for (const option of options) {
    const score = Array.from(option.votes.entries())
      .map(([k, v]) => voteToScore(k) * v)
      .reduce((a, x) => a + x, 0);
    if (score > maxScore) {
      choice = option.value;
      maxScore = score;
    }
  }

  return choice;
}
